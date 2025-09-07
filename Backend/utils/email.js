const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(options) {
    this.emailOwner = process.env.EMAIL_WEBSITE_OWNER;
    this.url = options.url || null;
    this.replyTo = options.email || null;
    this.message = options.message || null;
    this.name = options.name || null;
  }

  // transport() {
  //   return nodemailer.createTransport({
  //     host: process.env.LIEBEVOLL_EMAIL_HOST,
  //     port: process.env.LIEBEVOLL_EMAIL_PORT,
  //     // secure: false,
  //     secureConnection: false,
  //     auth: {
  //       user: process.env.LIEBEVOLL_EMAIL_USER,
  //       pass: process.env.LIEBEVOLL_EMAIL_PASSWORD,
  //     },
  //     tls: {
  //       // do not fail on invalid certs
  //       rejectUnauthorized: false,
  //     },
  //   });
  // }

  transport() {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.emailOwner,
        pass: process.env.EMAIL_WEBSITE_OWNER_PASSWORD,
      },
    });
  }

  async sendEmail(html, subject) {
    const mailoptions = {
      from: this.emailOwner,
      to: this.emailOwner,
      subject,
      html,
    };

    await this.transport().sendMail(mailoptions);
  }

  async sendUserConfirmToken() {
    const html = `<h3>Folge diesem Link, um den neuen User zu bestätigen:</h3>
                  <h4>${this.url}</h4>`;

    await this.sendEmail(html, 'User Confirm Token');
  }

  async sendCustomerRequestEmail() {
    const html = `<h4>Eine Anfrage von: ${this.name}<h4/>
                   <h4>E-Mail: ${this.replyTo} </h4>
                   <p>${this.message}<p/>`;

    await this.sendEmail(html, 'Kundenanfrage von Liebevollbelichtet');
  }
};
