require('dotenv').config()
const _ = require('lodash');
const axios = require('axios');
const moment = require('moment')
const { promises: fs } = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const { Parser } = require('json2csv');

const main = async () => {
    try {
        let recordNumbers: number = 0
        const config = {
            headers: { Authorization: `${process.env.AUTH}` }
        };
        const url = process.env.URL

        const resp = await axios.get(url, config);
        let jsonData = resp.data

        const csvWriter2 = createCsvWriter({
            path: './csv/export.csv',
            header: [
                'rowCounter',
                'invoice_requested',
                'customer_edited',
                'address_edited',
                'customer_first_name',
                'customer_last_name',
                'note_attributes1',
                'note_attributes0',
                'customer_default_address_zip',
                'customer_default_address_address1',
                'customer_default_address_city',
                'customer_default_address_country_name',
                'customer_default_address_province',
                'customer_email',
                'customer_default_address_country_code',
                'billing_address_first_name',
                'billing_address_last_name',
                'billing_address_zip',
                'billing_address_address1',
                'billing_address_address2',
                'billing_address_city',
                'billing_address_county_name',
                'billing_address_province',
                'billing_email',
                'billing_address_country_code',
                'shipping_address_first_name',
                'shipping_address_last_name',
                'shipping_address_zip',
                'shipping_address_address1',
                'shipping_address_address2',
                'shipping_address_city',
                'shipping_address_country_name',
                'shipping_address_province',
                'shipping_email',
                'shipping_address_country_code',
                'customer_created_at',
                'termini_di_pagamento',
                'incoterms',
                'incoterms_location'
            ],
            fieldDelimiter: ';',
            append: true
        });
        const csvWriter3 = createCsvWriter({
            path: './csv/export.csv',
            header: [
                'rowCounter',
                'id',
                'sku',
                'quantity',
                'storage_location',
                'condition_price',
                'price',
                'condition_discount',
                'total_discount',

            ],
            fieldDelimiter: ';',
            append: true
        });
        const csvWriterHeader = createCsvWriter({
            path: './csv/export.csv',
            header: [
                'rowCounter',
                'date',
                'time'
            ],
            fieldDelimiter: ';',

        });
        const records1 = [
            { rowCounter: '1', date: moment().format('YYYY-MM-DD'), time: moment().utcOffset('+0200').format('HH:mm:ss') }
        ]
        await csvWriterHeader.writeRecords(records1)

        for (const json of jsonData) {
            if (!json.customer) {
                console.log(`Order ${json.id} - Customer not found`);
                continue
            };
            if (!json.billing_address) {
                console.log(`Order ${json.id} - Billing address not found`);
                continue
            };
            if (!json.shipping_address) {
                console.log(`Order ${json.id} - Shipping address not found`);
                continue
            };
            if (!json.line_items) {
                console.log(`Order ${json.id} - Line items not found`);
                continue
            };
            if (!json.note_attributes) {
                console.log(`Order ${json.id} - Note attributes not found`);
                continue
            };

            const fiscal_code = _.find(json.note_attributes, (item: any) => item.name == 'fiscalCode')
            if (_.isNil(fiscal_code))
                continue;

            const vat_number = _.find(json.note_attributes, (item: any) => item.name == 'vatNumber')
            if (_.isNil(vat_number))
                continue;

            const records2 = [
                {
                    rowCounter: '2',
                    invoice_requested: '',
                    customer_edited: '',
                    address_edited: '',
                    customer_first_name: json.customer.first_name,
                    customer_last_name: json.customer.last_name,
                    fiscal_code: fiscal_code.value,
                    vat_number: vat_number.value,
                    customer_default_address_zip: json.customer.default_address.zip,
                    customer_default_address_address1: json.customer.default_address.address1,
                    customer_default_address_city: json.customer.default_address.city,
                    customer_default_address_country_name: json.customer.default_address.country_name,
                    customer_default_address_province: json.customer.default_address.province,
                    customer_email: json.customer.email,
                    customer_default_address_country_code: json.customer.default_address.country_code,
                    billing_address_first_name: json.billing_address.first_name,
                    billing_address_last_name: json.billing_address.last_name,
                    billing_address_zip: json.billing_address.zip,
                    billing_address_address1: json.billing_address.address1,
                    billing_address_address2: json.billing_address.address2,
                    billing_address_city: json.billing_address.city,
                    billing_address_county_name: json.billing_address.county_name,
                    billing_address_province: json.billing_address.province,
                    billing_email: json.customer.email,
                    billing_address_country_code: json.billing_address.county_code,
                    shipping_address_first_name: json.shipping_address.first_name,
                    shipping_address_last_name: json.shipping_address.last_name,
                    shipping_address_zip: json.shipping_address.zip,
                    shipping_address_address1: json.shipping_address.address1,
                    shipping_address_address2: json.shipping_address.address2,
                    shipping_address_city: json.shipping_address.city,
                    shipping_address_country_name: json.shipping_address.country,
                    shipping_address_province: json.shipping_address.province,
                    shipping_email: json.customer.email,
                    shipping_address_country_code: json.shipping_address.country_code,
                    customer_created_at: moment(json.customer.created_at, ['YYYY-MM-DDThh:mm:ssTZD']).format("DD.MM.YYYY"),
                    termini_di_pagamento: "0001",
                    incoterms: "EXW",
                    incoterms_location: "Roma"
                }
            ];
            recordNumbers += records2.length
            await csvWriter2.writeRecords(records2)

            for (const line of json.line_items) {
                const records3 = [
                    {
                        rowCounter: '3',
                        id: json.id,
                        sku: line.sku,
                        quantity: line.quantity,
                        storage_location: "LDIS",
                        condition_price: "ZPR0",
                        price: line.price,
                        condition_discount: "",
                        total_discount: line.total_discount
                    }
                ];
                await csvWriter3.writeRecords(records3)
                recordNumbers += records3.length
            }
        }

        const csvWriterFooter = createCsvWriter({
            path: './csv/export.csv',
            header: [
                'rowCounter',
                'date',
                'time',
                'recordNumber'
            ],
            fieldDelimiter: ';',
            append: true,
        });
        const records9 = [
            { rowCounter: '9', date: moment().format('YYYY-MM-DD'), time: moment().utcOffset('+0200').format('HH:mm:ss'), recordNumber: recordNumbers }
        ]
        await csvWriterFooter.writeRecords(records9)
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};
main();