import User from '../database/models/user_model';

export const accessToken = (req, res) => {
    try {
        const token = req.cookies.accessToken;
        const data = jwt.verify(token, process.env.ACCESS_SECRET_KEY);

        const userData = userDatabase.filter(item => {
            return item.email === data.email;
        })[0];

        const { password, ...others } = userData;

        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const refreshToken = (req, res) => {
    // 용도 : access token을 갱신.
    try {
        const token = req.cookies.refreshToken;
        const data = jwt.verify(token, process.env.REFRECH_SECRET)
        const userData = userDatabase.filter(item => {
            return item.email === data.email;
        })[0]

        // access Token 새로 발급
        const accessToken = jwt.sign({
            id: userData.id,
            username: userData.username,
            email: userData.email,
        }, process.env.ACCESS_SECRET, {
            expiresIn: '1m',
            issuer: 'About Tech',
        });

        res.cookie("accessToken", accessToken, {
            secure: false,
            httpOnly: true,
        })

        res.status(200).json("Access Token Recreated");

    } catch (error) {
        res.status(500).json(error);
    }
};