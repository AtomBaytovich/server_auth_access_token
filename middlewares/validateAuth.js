import jwt from 'jsonwebtoken';

const text = 'Пользователь не авторизован';

function authCheck(req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization?.split(' ')[1] // Bearer xxxx.xxx.xxxx
        if (!token) {
            return res.status(401).json({ message: text })
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_JWT)
        req.user = decoded;
        return next();
    } catch (e) {
        res.status(401).json({ message: text })
    }
}

export default authCheck
