import express from 'express';
let app = express();

import { app as appV1Api } from './v1/index.js';

app.use("/v1", appV1Api)

export { app }
