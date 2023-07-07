import jwt from 'jsonwebtoken';

const secretKey = "임시시크릿키";

const setUserToken = (res,user)=>{
    //유저 jwt 토큰 생성
    const token = jwt.sign(user, secret);
    // 토큰을 쿠키로 전달
    res.cookie('token', token)
}

export { secretKey, setUserToken };