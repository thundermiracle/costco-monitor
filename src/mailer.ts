import nodemailer, { SendMailOptions, Transporter } from "nodemailer";

interface IMailer {
  sendMail: (
    subject: string,
    message: string,
    mailOptions?: SendMailOptions,
  ) => Promise<void>;
}

class Mailer implements IMailer {
  private transporter: Transporter | null = null;

  private initTransporter() {
    const transporter = nodemailer.createTransport({
      service: process.env.MailService,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MailUser,
        pass: process.env.MailPassword,
      },
    });

    this.transporter = transporter;
  }

  sendMail(
    subject: string,
    message: string,
    mailOptions?: SendMailOptions,
  ): Promise<any> {
    if (this.transporter == null) {
      this.initTransporter();
    }

    const defaultOptions = {
      from: process.env.MailUser,
      to: process.env.MailTo,
      subject,
      text: message,
    };
    const allMailOptions: SendMailOptions = {
      ...defaultOptions,
      ...mailOptions,
    };

    return new Promise((resolve, reject) => {
      this.transporter!.sendMail(allMailOptions, function (error, info: any) {
        if (error) {
          reject(error);
        } else {
          // eslint-disable-next-line
          resolve(info);
        }
      });
    });
  }
}

const mailer = new Mailer();

export default mailer;
