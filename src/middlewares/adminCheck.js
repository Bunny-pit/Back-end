import jwt from 'jsonwebtoken';

export function adminCheck(req, res, next) {
    const userToken = req.headers.cookie.split("=")[1];

    // 토큰이 없을 경우 login_required 가 필요한 서비스 사용을 제한.
    if (!userToken || userToken === "null") {
        console.log("Authorization을 위한 토큰 없음");

        res.status(403).json({
            result: "forbidden-approach",
            message: "로그인한 유저만 사용할 수 있는 서비스입니다.",
        });

        return;
    }

    // 해당 token 이 정상적인 token인지 확인
    try {
        const accessKey = process.env.ACCESS_SECRET_KEY || "엑세스키할당필요함";
        const jwtDecoded = jwt.verify(userToken, accessKey);
        const { role } = jwtDecoded;

        if (role !== '1') {
            throw new Error('관리자가 아닙니다.')
        }

        next();
    } catch (error) {
        console.error(error);
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                error: 'TokenExpiredError',
                message: '토큰이 만료되었습니다.'
            })
        } else {
            next();
        }
    }
}