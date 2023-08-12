import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default function loginRequired(req, res, next) {
  const userToken =
    req.headers['authorization']?.split(' ')[1] || req.cookies['accessToken'];
  // 토큰이 없을 경우 login_required 가 필요한 서비스 사용을 제한.
  if (!userToken || userToken === 'null' || userToken === undefined) {
    res.status(403).json({
      result: 'forbidden-approach',
      message: '로그인이 필요한 서비스입니다.',
    });
    return;
  }
  try {
    const accessKey = process.env.ACCESS_SECRET_KEY || 'bunnybunny';
    const decodedData = jwt.verify(userToken, accessKey);
    req.oid = decodedData.userOid;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: 'TokenExpiredError',
        message: '토큰이 만료되었습니다.',
      });
    } else {
      return res.status(401).json({
        error: 'InvalidTokenError',
        message: '유효하지 않은 토큰입니다.',
      });
    }
  }
}
