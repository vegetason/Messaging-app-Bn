import dotenv from "dotenv";

dotenv.config();

export function generateEmailTemplate(subject:string,body:string,buttonInfo:string,link:string,username:string){
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Newsletter from Your Company - [Subject Here]</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                background: #ffffff;
                margin: 20px auto;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                background: #007bff;
                color: white;
                padding: 20px;
                border-radius: 10px 10px 0 0;
            }
            .subject {
                text-align: center;
                font-size: 18px;
                font-weight: bold;
                margin: 10px 0;
            }
            .content {
                padding: 20px;
                color: #333;
            }
            .button {
                display: inline-block;
                background: #007bff;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
            }
            .footer {
                text-align: center;
                padding: 10px;
                font-size: 12px;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>ChatApp</h1>
            </div>
            <div class="subject">
                ${subject}
            </div>
            <div class="content">
                <p>Hello ${username}</p>
                <p>${body}</p>
                <p><a href="${link}" class="button">${buttonInfo}</a></p>
            </div>
            <div class="footer">
                <p>&copy; 2025 Chat App. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `
}

export const verifyEmailInfo={
    body:`Thank you for signing up! Please verify your email address to activate your account.`,
    buttonInfo:`Verify Email`,
    link: process.env.VERIFY_EMAIL_LINK as string,
    subject:`Verify Your Email Address`
}
