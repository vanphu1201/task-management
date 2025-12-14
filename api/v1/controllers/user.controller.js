const User = require("../models/user.model");
const md5 = require("md5");

// [POST] /api/v1/users/register
module.exports.register = async (req, res) => {
    try {
        req.body.password = md5(req.body.password);

        const existEmail = await User.findOne({
            email: req.body.email,
            deleted: false
        });

        if (existEmail) {
            res.json({
                code: 400,
                message: "Email đã tồn tại"
            })
        } else {
            const newUser = new User(req.body);
            await newUser.save();

            const token = newUser.token;
            res.cookie("token", token);

            res.json({
                code: 200,
                message: "Tạo tài khoản thành công!",
                token: token
            })
        }
        
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi tạo tài khoản!"
        })
    }
}