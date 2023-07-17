const NewsLetter = require("../models/NewsLetter");
const nodemailer = require("nodemailer");

const { google } = require("googleapis");

const CLIENT_ID =
  "439843278172-filmvumot0kfo3842gobr7fn04glhc8c.apps.googleusercontent.com";
const CLEINT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04Pdf01rD2xcYCgYIARAAGAQSNwF-L9IrJvAJBCQUu3oucQ3tPrVjvmhNK8s2MugFI0tqKvHP9j752MMFex6sxw0_bd3D3vWpiPY";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const subsrcibe = async (req, res) => {
  try {
    const newsletter = await NewsLetter.find();

    if (newsletter.length == 0) {
      newNewsLetter = new NewsLetter({
        emails: [req.body.email],
      });

      savednewsLetter = await newNewsLetter.save();
      const accessToken = oAuth2Client.getAccessToken();
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "zaineb.bencheikh@korsgy.com",
          clientId: CLIENT_ID,
          clientSecret: CLEINT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });
      const mailOptions = {
        from: "Zaineb <zaineb.bencheikh@korsgy.com>",
        to: req.body.email,
        subject: "newsletter ogc",
        text: "thanks for subscribing",
      };
      console.log("we are trying to send email");
      const result = transport.sendMail(mailOptions);
      result
        .then((result) => console.log("Email sent...", result))
        .catch((error) => console.log(error.message));
      res.status(201).json(savednewsLetter);
    } else {
      if (newsletter[0].emails.includes(req.body.email)) {
        res.status(400).json("already subscribed");
      } else {
        newsletter[0].emails.push(req.body.email);
        savednewsLetter = await newsletter[0].save();
        const accessToken = oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: "zaineb.bencheikh@korsgy.com",
            clientId: CLIENT_ID,
            clientSecret: CLEINT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
          },
        });
        const mailOptions = {
          from: "Zaineb <zaineb.bencheikh@korsgy.com>",
          to: req.body.email,
          subject: "newsletter ogc",
          text: "thanks for subscribing",
        };
        console.log("we are trying to send email");
        const result = transport.sendMail(mailOptions);
        result
          .then((result) => console.log("Email sent...", result))
          .catch((error) => console.log(error.message));
        res.status(200).json(savednewsLetter);
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendMails = async (req, res) => {
  try {
    const newsletters = await NewsLetter.find();
    if (newsletters.length == 0) {
      res.status(400).json("no mails to send to");
    } else {
      if (newsletters[0].emails.length == 0) {
        res.status(400).json("no mails to send to");
      } else {
        const accessToken = oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: "zaineb.bencheikh@korsgy.com",
            clientId: CLIENT_ID,
            clientSecret: CLEINT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
          },
        });
        const mailOptions = {
          from: "Zaineb <zaineb.bencheikh@korsgy.com>",
          to: newsletters[0].emails,
          subject: req.body.subject,
          text: req.body.text,
        };
        console.log("we are trying to send email");
        const result = transport.sendMail(mailOptions);
        result
          .then((result) => res.status(200).json(result))
          .catch((error) => res.status(500).json({ error: error.message }));
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  subsrcibe,
  sendMails,
};
