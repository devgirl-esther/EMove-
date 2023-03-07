"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            service: 'gmail',
            secure: false,
            auth: {
                user: process.env.USEREMAIL,
                pass: process.env.PASS,
            },
        });
        await transporter.sendMail({
            from: process.env.USEREMAIL,
            to: email,
            subject: subject,
            html: text,
        });
        console.log("Email sent Successfully");
    }
    catch (err) {
        console.log(err);
    }
};
exports.sendEmail = sendEmail;
