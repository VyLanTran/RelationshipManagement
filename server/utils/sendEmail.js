import nodemailer from 'nodemailer'

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.PASS,
            },
        })

        await transporter.sendMail({
            to: email,
            // TODO: Draft a professional email after the app name is set
            subject: subject,
            text: text,
        })
    } catch (error) {
        return error
    }
}

export default sendEmail
