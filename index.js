import express from 'express';
import helmet from 'helmet';
import { createServer } from 'http';
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressMongoSanitize from 'express-mongo-sanitize';
import xssClean from 'xss-clean';
import chalk from 'chalk';
import mongoose from 'mongoose';

import { app as indexApp } from "./api/index.js"

const app = express();

const httpServer = createServer(app);

let PORT = process.env.PORT || 5000;

app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.use(
    cors({
        origin: ['localhost:3000'],
        credentials: true
    })
);

app.use(bodyParser.json({
    limit: "20mb"
}));

app.use(bodyParser.urlencoded({
    limit: "20mb",
    extended: true
}));

app.use(cookieParser());

app.use(expressMongoSanitize());
app.use(xssClean());

app.use(compression());

app.use("/api", indexApp);

app.use((req, res) => {
    return res.status(404).send("404 | Not found");
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("500 | Internal Server Error ")
});

async function startServer() {
    try {
        await mongoose.connect(process.env.BD_TOKEN, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        await httpServer.listen(PORT, async () => {
            console.log(chalk.blue(`Сервер успешно запущен на порту: ${PORT}`));
        });
    } catch (e) {
        console.log(chalk.red('Ошибка запуска!'))
        console.log(e)
    }
}

startServer();
