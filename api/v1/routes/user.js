import express from 'express';
import { body } from 'express-validator';
import userController from '../../../controllers/userController.js';
import authCheck from '../../../middlewares/validateAuth.js'

let router = express.Router();

router.put('/password', authCheck, [
    body('oldPassword').isLength({ min: 8, max: 25 }),
    body('newPassword').isLength({ min: 8, max: 25 }),
], async (req, res) => {
    await userController.changePassword(req, res)
})

export {
    router
}