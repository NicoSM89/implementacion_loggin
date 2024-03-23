const express = require('express');
const winston = require('winston');

const app = express();

// priority
const levels = {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5
};

// colors logging
const colors = {
    debug: 'blue',
    http: 'green',
    info: 'cyan',
    warning: 'yellow',
    error: 'red',
    fatal: 'magenta'
};

//  logger development
const developmentLogger = winston.createLogger({
    levels: levels,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console()
    ]
});

// logger production
const productionLogger = winston.createLogger({
    levels: levels,
    transports: [
        new winston.transports.File({ filename: 'errors.log', level: 'error' })
    ]
});

// Middleware
function loggerMiddleware(req, res, next) {
    // Log init
    developmentLogger.http(`${req.method} ${req.url}`);

    // error, register logger of production
    const originalSend = res.send;
    res.send = function (data) {
        if (res.statusCode >= 400) {
            productionLogger.error(`${res.statusCode} - ${req.method} ${req.url}: ${JSON.stringify(data)}`);
        }
        originalSend.apply(res, arguments);
    };

    next();
}

// Logs server
function importantLog() {
    developmentLogger.info("Este es un log importante.");
    productionLogger.info("Este es un log importante.");
}

// Rutes logs
app.get('/loggerTest', (req, res) => {
    importantLog();
    res.send('Logs generados para probar.');
});

// example logs
app.get('/', (req, res) => {
    console.log('Esta es una consola de registro normal.');
    res.send('Hello World!');
});

// conf server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
