// 전달된 리퀘스트 핸들러는 try~ catch로 감싸 asyncHandler 내에서 awiat으로 실행.
// 어싱크 핸들러의 catch에 리퀘스트 핸들러의 오류가 잡혀 자동으로 오류처리, 리퀘스트 핸들러의 오류가 미들웨어로 전달

export const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res);
        } catch (err) {
            next(arr);
        }
    }
}