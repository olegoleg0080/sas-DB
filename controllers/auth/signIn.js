import HTTPError from "../../helpers/HTTPError.js";
import { User } from "../../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

const signin = async (req, res) => {
    const { email, password } = req.body.params;

    const user = await User.findOne({ email });
    if (!user) {
        throw HTTPError(401, "Email or password invalid");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw HTTPError(401, "Email or password invalid");
    }

    // Проверяем, есть ли у пользователя токен
    const existingToken = user.token;

    if (existingToken) {
        try {
            // Проверяем, не истёк ли токен
            jwt.verify(existingToken, JWT_SECRET);
            // Если токен валиден, возвращаем его
            return res.status(200).json({
                token: existingToken,
                user: {
                    email,
                    id: user._id,
                    userName: user.userName,
                },
            });
        } catch (error) {
            // Если токен истёк, создаём новый
            console.log("Token expired, creating a new one");
        }
    }

    // Создаём новый токен
    const payload = { id: user._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
        token,
        user: {
            email,
            id: user._id,
            userName: user.userName,
        },
    });
};

export default signin;
