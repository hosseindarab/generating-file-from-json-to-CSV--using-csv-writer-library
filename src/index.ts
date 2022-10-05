const axios = require('axios');
const moment = require('moment')
var now = new Date();
var format = 'Y-m-d' + '.' + 'H:i:s'
var formattedDate = moment(now).format('LLL')
require('dotenv').config()
// const { promises: fs } = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
// const { parse } = require('json2csv');

const main = async () => {
    try {
        const config = {
            headers: { Authorization: `${process.env.AUTH}` }
        };
        const url = process.env.URL

        // const bodyParameters = {
        //    key: "value"
        // };
        const resp = await axios.get(url, config);
        let jsonData = resp.data
        const csvWriter = createCsvWriter({
            path: './csv/' + moment(now).format('LLL') + '.csv',
            headerIdDelimiter: '.',
            header: [
                { id: formattedDate},
                { id: 'id', title: 'ID' }
            ]
        })
        await csvWriter.writeRecords(jsonData)
        // console.log(resp.data);
        // var arr = typeof json !== 'object' ? JSON.parse(json) : json;
        // var str =
        //     `${Object.keys(arr[0])
        //         .map((value) => `"${value}"`)
        //         .join(',')}` + '\r\n';
        // var csvContent = arr.reduce((st: any, next: any) => {
        //     st +=
        //         `${Object.values(next)
        //             .map((value) => `"${value}"`)
        //             .join(',')}` + '\r\n';
        //     return st;
        // }, str);
        // console.log(csvContent)
        // var json = resp.data
        // var fields = Object.keys(json)
        // // const opts = { fields };
        // // const csv = parse(json, opts);
        // // console.log(csv);
        // var replacer = function (key, value) { return value === null ? '' : value }
        // var csv = json.map(function (row) {
        //     return fields.map(function (fieldName) {
        //         return JSON.stringify(row[fieldName], replacer)
        //     }).join(',')
        // })
        // csv.unshift(fields.join(',')) // add header column
        // csv = csv.join('\r\n');
        // console.log(csv)
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};
main();