"use strict";
const axios = require('axios');
const moment = require('moment');
var now = new Date();
var format = 'Y-m-d' + '.' + 'H:i:s';
var formattedDate = moment(now).format('LLL');
require('dotenv').config();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const main = async () => {
    try {
        const config = {
            headers: { Authorization: `${process.env.AUTH}` }
        };
        const url = process.env.URL;
        const resp = await axios.get(url, config);
        let jsonData = resp.data;
        const csvWriter = createCsvWriter({
            path: './csv/' + moment(now).format('LLL'),
            headerIdDelimiter: '.',
            header: [
                { id: formattedDate },
                { id: 'id', title: 'ID' }
            ]
        });
        await csvWriter.writeRecords(jsonData);
    }
    catch (err) {
        console.error(err);
    }
};
main();
//# sourceMappingURL=index.js.map