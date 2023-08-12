import jwt from 'jsonwebtoken';

export default function adminCheck(req, res, next) {
    const userToken =
        req.headers['authorization']?.split(' ')[1] || req.cookies['accessToken'];

    // 토큰이 없을 경우 login_required 가 필요한 서비스 사용을 제한.
    if (!userToken || userToken === "null") {
        res.status(403).json({
            result: "forbidden-approach",
            message: "로그인이 필요한 서비스입니다.",
        });
        return;
    }

    // 해당 token 이 정상적인 token인지 확인
    try {
        const accessKey = process.env.ACCESS_SECRET_KEY || "bunnybunny";
        const jwtDecoded = jwt.verify(userToken, accessKey);
        const { role } = jwtDecoded;

        if (role == 1) {
            next();
        }
        else {
            res.status(404).json('관리자가 아닙니다.')
        }
    } catch (error) {
        console.error(error);
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                error: 'TokenExpiredError',
                message: '토큰이 만료되었습니다.'
            })
        } else {
            return res.status(500).json({
                error: 'server errror',
                message: '서버 이슈 발생.'
            })
        }
    }
}