import jwt from 'jsonwebtoken'
import { Response } from 'express'

const generateTokenAndSetCookie = (res: Response, userId: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d',
    });

    res.cookie("jwt", token, {
        httpOnly: true, //more secure
        maxAge: 15 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
    });

    return token;
}

export default generateTokenAndSetCookie;