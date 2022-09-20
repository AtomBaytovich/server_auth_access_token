import jwt from 'jsonwebtoken';

const generateJwt = ({ login, email }) => {
    return jwt.sign(
        { login, email },
        process.env.ACCESS_TOKEN_SECRET_JWT,
        { expiresIn: '15d' }
    )
}

export {
    generateJwt
}