import UserService from "../services/user_service.js";

const UserController = {
    async createUser(req, res) {
        try {
            const { userName, email, password } = req.body
            const registerData = {
                userName,
                email,
                password
            }
            const newUser = await UserService.createUser(registerData);

            res.status(201).json(newUser);
        } catch (err) {
            res.status(500).json({ err: err.message })
        }
    },
    async updateUser(req, res) {
        try {
            const { userName, password } = req.body
            const updateData = {
                userName,
                password
            }
            const updatedUser = await UserService.updateUser(updateData);
            res.status(201).json(updatedUser);

        } catch (err) {
            res.status(500).json({ err: err.message })
        }
    },
}
export default UserController;

    // jwt로 password 업데이트. jwt를 db에 저장해서 보안성 강화하는 방법도 있음.(근데 jwt는 db안쓰려고 사용.)
    // 구글 원격 강제 로그아웃기능 이 방식으로 구현.
    //jwt는 로그아웃이 안되니 만료를 짧게.
    //유저컨트롤러 수정 필요.