import jwt from 'jsonwebtoken'

const generateTokenAndSetCookie = (res, userId) => {
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