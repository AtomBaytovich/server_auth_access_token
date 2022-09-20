import express from 'express';
import { router as routesAuth } from './routes/auth.js'
import { router as routesUser } from './routes/user.js'

let app = express();

app.use('/auth', routesAuth)
app.use('/user', routesUser)

export {
    app
}