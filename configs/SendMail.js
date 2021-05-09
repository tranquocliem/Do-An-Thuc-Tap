const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const sgMail = require("@sendgrid/mail");

const {
  SENDER_MAIL,
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL,
  REFRESH_TOKEN,
} = process.env;

const oAuth2Client = new OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REFRESH_TOKEN,
  REDIRECT_URL
);

const sendMail = async (to, url, sub, wc, btn, time) => {
  try {
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: SENDER_MAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
    });

    const mainOptions = {
      from: SENDER_MAIL,
      to: to,
      subject: sub,
      html: `
      <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
      <h2 style="text-align: center; text-transform: uppercase;color: teal;">Chào mừng bạn đến với 𝓲𝓷𝓼𝓽𝓪𝓰𝓲𝓻𝓵.</h2>
      <p>${wc}
      Chỉ cần nhấp vào nút bên dưới để thực hiện yêu cầu của bạn.
      </p>
      
      <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${btn}</a>
      
      <div style="color:red;font-size:1rem;">Lưu ý: Email này chỉ có hiệu lực trong ${time}.</div>
      
      <div style="opacity: 0.8;text-align: center;">
      
      <small>
      © 2021 INSTAGIRL FROM
      <a href="https://www.facebook.com/tranquocliem99/" target="_blank" rel="noreferrer">
      TRẦN QUỐC LIÊM
      </a>
      </small>
      </div>
      
      </div>
      `,
    };

    transporter.sendMail(mainOptions, (err, infor) => {
      if (err) return;
      return infor;
    });
  } catch (error) {
    console.log(error);
    return Promise.reject("401");
  }
};

const sendGrid = async (to, url, sub, wc, btn, time) => {
  try {
    sgMail.setApiKey(process.env.API_KEY_SENDGRID);

    const message = {
      to: to, // Change to your recipient
      from: {
        name: "Trần Quốc Liêm",
        email: process.env.SENDER_SENDGRID,
      }, // Change to your verified sender
      subject: sub,
      html: `
      <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
      <h2 style="text-align: center; text-transform: uppercase;color: teal;">Chào mừng bạn đến với 𝓲𝓷𝓼𝓽𝓪𝓰𝓲𝓻𝓵.</h2>
      <p>${wc}
      Chỉ cần nhấp vào nút bên dưới để thực hiện yêu cầu của bạn.
      </p>
      
      <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${btn}</a>
      
      <div style="color:red;font-size:1rem;">Lưu ý: Email này chỉ có hiệu lực trong ${time}.</div>
      
      <div style="opacity: 0.8;text-align: center;">
      
      <small>
      © 2021 INSTAGIRL FROM
      <a href="https://www.facebook.com/tranquocliem99/" target="_blank" rel="noreferrer">
      TRẦN QUỐC LIÊM
      </a>
      </small>
      </div>
      
      </div>
      `,
    };
    await sgMail.send(message);
    return;
  } catch (error) {
    console.log(error);
    return Promise.reject("401");
  }
};

module.exports = { sendMail, sendGrid };
