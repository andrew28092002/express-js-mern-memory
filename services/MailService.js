import * as nodemailer from 'nodemailer'

class MailService{
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })

        this.transporter.verify((err, success) => {
            if (err) console.error(err);
        });
    }

    async sendActivaitonEmail(to, activationLink){
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта на ' + process.env.API_URL,
            text: '',
            html: 
            `
                <div style="display: flex; justify-content: center; align-items: center; text-align: center">
                    <h1>Для активации перейдите по ссылке</h1>
                    <a style="text-decoration: none" href="${activationLink}">${activationLink}</a>
                </div>    
            `
        })
    }
}

export default new MailService()