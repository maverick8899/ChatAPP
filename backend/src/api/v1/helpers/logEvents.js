const fs = require('fs').promises;
const path = require('path');
const { format } = require('date-fns'); //format date

const fileName = path.join(__dirname, '../Logs', 'log.log');
const logEvents = async (msg) => {
    try {
        const dateTime = `${format(new Date(), 'dd-MM-yyyy | HH:mm:ss')}`;
        const content = `${dateTime} - ${msg}\n`;
        fs.appendFile(fileName, content);
    } catch (error) {
        console.log(error);
    }
};
module.exports = logEvents;
