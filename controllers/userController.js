import { validationResult } from 'express-validator';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import { generateJwt } from '../tools/tools.js';

class UserController {

    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw { name: "NOT_CORRECT" };
            const { login, password, email } = req.body;

            const cand = await User.findOne({
                $or: [{
                    login
                },
                {
                    email
                }]
            }).lean();
            console.log(cand)
            if (cand) throw { name: 'ALREADY_USER_REG' };

            const hashPassword = await bcrypt.hash(password, 5)

            await User.create({ email, login, password: hashPassword });
            const accessToken = generateJwt({ login, email });

            return res.json({
                accessToken,
                user: {
                    login,
                    email
                }
            })

        } catch (e) {
            console.log(e)
            if (e?.name === "NOT_CORRECT") {
                return res.status(400).json({
                    status: "error",
                    payload: e?.name,
                    message: "Некорректные данные при вводе. Попробуйте снова!"
                });
            } if (e?.name === "ALREADY_USER_REG") {
                return res.status(500).json({
                    status: "error",
                    payload: e?.name,
                    message: "Пользователь с таким логином или email уже существует!"
                });
            } else {
                return res.status(500).json({
                    status: "error",
                    payload: e?.name,
                    message: "Упс... Что-то пошло не так. Попробуйте снова!"
                })
            }
        }
    }

    async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw { name: "NOT_CORRECT" };

            const { login, password } = req.body;
            const user = await User.findOne({ login }).lean();
            if (!user) throw { name: 'NOT_FOUND' };

            const comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) throw { name: 'PASSWORD_INCORRECT' };

            const accessToken = generateJwt({ login, email: user.email });
            return res.json({
                accessToken,
                user: {
                    login,
                    email: user.email
                }
            })

        } catch (e) {
            if (e?.name === "NOT_CORRECT") {
                return res.status(400).json({
                    status: "error",
                    payload: e?.name,
                    message: "Некорректные данные при вводе. Попробуйте снова!"
                });
            } if (e?.name === "NOT_FOUND") {
                return res.status(401).json({
                    status: "error",
                    payload: e?.name,
                    message: "Неверный логин или пароль!"
                });
            } if (e?.name === "PASSWORD_INCORRECT") {
                return res.status(401).json({
                    status: "error",
                    payload: e?.name,
                    message: "Неверный логин или пароль!"
                });
            } else {
                return res.status(500).json({
                    status: "error",
                    payload: e?.name,
                    message: "Упс... Что-то пошло не так. Попробуйте снова!"
                })
            }

        }
    }

    async changePassword(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw { name: "NOT_CORRECT" };

            const { oldPassword, newPassword } = req.body;
            const user = await User.findOne({ login: req.user.login });
            if (!user) throw { name: 'NOT_FOUND' };

            const comparePassword = bcrypt.compareSync(oldPassword, user.password);
            if (!comparePassword) throw { name: 'PASSWORD_INCORRECT' };
            if (oldPassword == newPassword) throw { name: 'PASSWORDS_MATCH' }
            const hashPassword = await bcrypt.hash(newPassword, 5)

            user.password = hashPassword;

            await user.save();
            return res.json({
                message: 'Пароль успешно был сменен!'
            });

        } catch (e) {
            if (e?.name === "NOT_CORRECT") {
                return res.status(400).json({
                    status: "error",
                    payload: e?.name,
                    message: "Некорректные данные при вводе. Попробуйте снова!"
                });
            }
            if (e?.name === "PASSWORD_INCORRECT") {
                return res.status(400).json({
                    status: "error",
                    payload: e?.name,
                    message: "Указан неверный пароль!"
                });
            }
            if (e?.name === "PASSWORDS_MATCH") {
                return res.status(400).json({
                    status: "error",
                    payload: e?.name,
                    message: "Отклонено. Старый пароль совпадает с новым!"
                });
            }
            else {
                return res.status(500).json({
                    status: "error",
                    payload: e?.name,
                    message: "Упс... Что-то пошло не так. Попробуйте снова!"
                })
            }
        }
    }

}

export default new UserController();