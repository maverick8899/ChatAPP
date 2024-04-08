const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const CLIENT_ID = process.env.EMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.EMAIL_CLIENT_SECRET;
const REDIRECT_URI = process.env.EMAIL_REDIRECT_URI;
const REFRESH_TOKEN = process.env.EMAIL_REFRESH_TOKEN;

const oAuth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2.setCredentials({ refresh_token: REFRESH_TOKEN });

module.exports = async function sendMail(otp, email) {
    try {
        console.log('sendMail_service'.yellow, { otp });
        const accessToken = await oAuth2.getAccessToken();
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'trankimbang0809@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken,
            },
        });
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Hey Guy 👻" <trankimbang0809@gmail.com>',
            to: `${email}`,
            subject: 'OTP',
            text: 'Your OTP code',
            html: `<!DOCTYPE html>
          <html>
          <head>
            <title>Mã OTP</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                padding: 30px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
              }
              h2 {
                color: #333;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin-top: 0;
              }
              p {
                color: #777;
              }
              .otp-code {
                font-size: 48px;
                font-weight: bold;
                padding: 15px;
                border-radius: 5px;
                background-color: #f8f8f8;
                color: #333;
                text-align: center;
                margin-bottom: 30px;
              }
              .btn {
                display: inline-block;
                background-color: #4CAF50;
                color: #fff;
                padding: 10px 20px;
                border-radius: 5px;
                text-decoration: none;
                margin-top: 20px;
              }
              .btn:hover {
                background-color: #45a049;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Mã OTP của bạn</h2>
              <p>Vui lòng sử dụng mã OTP dưới đây để xác minh tài khoản của bạn:</p>
              <div class="otp-code">${otp}</div>
            </div>
          </body>
          </html>
          
          `, // html body
        });
        console.log('info'.green, info);

        return { code: 200, message: 'send email is successful' };
    } catch (error) {
        console.log(error);
    }
};
