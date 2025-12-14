const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password.model");


const md5 = require("md5");
const generate = require("../../../helper/generate");
const sendMailHelper = require("../../../helper/sendMail");


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


// [POST] /api/v1/users/login
module.exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = md5(req.body.password);
        const user = await User.findOne({
            email: email,
            deleted: false
        })

        if (!user) {
            res.json({
                code: 400,
                message: "Email không tồn tại!"
            })         
            return;
        }

        if (password !== user.password) {
            res.json({
                code: 400,
                message: "Mật khẩu không đúng!"
            })         
            return;
        }
        
        const token = user.token;
        res.cookie("token", token);

        res.json({
            code: 200,
            message: "Đăng nhập thành công!",
            token: token
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi đăng nhập thất bại!"
        })
    }
}


// [POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
    try {
        const email = req.body.email;

        const user = await User.findOne({
            email: email,
            deleted: false
        });

        if (!user) {
            res.json({
                code: 400,
                message: "Email không tồn tại!"
            });
            return
        }

        const otp = generate.generateRandomNumber(8);

        const timeExpire = 5;


        // Lưu data vào database
        const objectForgotPassword = {
            email: email,
            otp: otp,
            expireAt: Date.now() + timeExpire*60,
        }

        const forgotPassword = new ForgotPassword(objectForgotPassword);
        await forgotPassword.save();


        // Gửi OTP qua email
        const subject = "Mã OTP xác minh lấy lại mật khẩu";
        const html = `
            Mã OTP để lấy laijmaatj khẩu của bạn là <b>${otp}</b> ( Sử dụng trong ${timeExpire} phút).
            Vui lòng không chia sẽ mã OTP này với bất kì ai!
        `;
        sendMailHelper.sendMail(email, subject, html)

        res.json({
            code: 200,
            message: " Đã gửi mã OTP qua email"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi lấy mật khẩu! "
        })
    }
}