import express from 'express';
import { body, query } from 'express-validator';
import userController from '../../../controllers/userController.js';

let router = express.Router();

router.post('/reg', [
    body('login').isLength({ min: 3, max: 40 }),
    body('password').isLength({ min: 8, max: 25 }),
    body('email').isEmail()
],
    async (req, res) => {
        await userController.registration(req, res)
    });

router.post('/login', [
    body('login').isLength({ min: 3, max: 40 }),
    body('password').isLength({ min: 8, max: 25 })
],
    async (req, res) => {
        await userController.login(req, res)
    });


export {
    router
}