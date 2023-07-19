import jwt from 'jsonwebtoken';

export default function loginRequired(req, res, next) {
  try {
    const { token } = req.headers;

    // 토큰이 없을 경우 login_required 가 필요한 서비스 사용을 제한.
    if (!userToken || userToken === "null") {
        console.log("Authorization을 위한 토큰 없음");

        return res.status(401).json({
            result: "forbidden-approach",
            message: "로그인한 유저만 사용할 수 있는 서비스입니다.",
        });
    }

    // 해당 token 이 정상적인 token인지 확인
    try {
        const accessKey = process.env.ACCESS_SECRET_KEY || "엑세스키할당필요함";
        const jwtDecoded = jwt.verify(userToken, accessKey);
        const userEmail = jwtDecoded.email;
        next();
    } catch (error) {
        return res.status(401).json({
            result: "forbidden-approach",
            message: "정상적인 토큰이 아닙니다.",
        });
    }

}

    req.email = email;
    req.isAdmin = isAdmin;

    next();
  } catch (err) {
    next(err);
  }
}