let winston = require('winston');
let fs = require('fs');

if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}

module.exports = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: "info",
            name: "info-file",
            filename: "logs/payfast-info.log",
            maxsize: 100000,
            maxFiles: 10
        }),
        new winston.transports.File({
            level: "error",
            name: "error-file",
            filename: "logs/payfast-error.log",
            maxsize: 100000,
            maxFiles: 10
        })
    ]
});
