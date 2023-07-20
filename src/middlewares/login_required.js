export default function loginRequired(req, res, next) {
  // request 헤더로부터 authorization bearer 토큰을 받음.
  const userToken = req.headers["authorization"]?.split(" ")[1];

  // 토큰이 없을 경우 login_required 가 필요한 서비스 사용을 제한.
  if (!userToken || userToken === "null") {
      console.log("Authorization을 위한 토큰 없음");

      res.status(401).json({
          result: "forbidden-approach",
          message: "로그인한 유저만 사용할 수 있는 서비스입니다.",
      });

      return;
  }

  // 해당 token 이 정상적인 token인지 확인
  try {
      const accessKey = process.env.ACCESS_SECRET_KEY || "엑세스키할당필요함";
      const jwtDecoded = jwt.verify(userToken, accessKey);
      const userEmail = jwtDecoded.email;

      next();
  } catch (error) {
      res.status(401).json({
          result: "forbidden-approach",
          message: "정상적인 토큰이 아닙니다.",
      });

      return;
  }
}