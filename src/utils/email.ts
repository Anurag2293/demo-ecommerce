
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

export const sendOTPEmail = async (email: string, name: string, otp: string) => {
    try {
      const mailerSend = new MailerSend({
        apiKey: process.env.MAILERSEND_API_KEY ?? "",
      });
      const sentFrom = new Sender(
        "mailersend@trial-z3m5jgr0nwogdpyo.mlsender.net",
        "Anurag Dhote",
      );
  
      const recipients = [new Recipient(email, name)];
  
      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject("One Time Password for verifying!")
        .setHtml(
          `<div>
            <strong>Hi, ${name}</strong>
            <h3>Welcome to Ecommerce IO!</h3>
            <p>Here's your One-Time Password (OTP) for completing signup: ${otp} </p>
          </div>`,
        )
        .setText("This is the text content");
  
      await mailerSend.email.send(emailParams);
  
      return { success: true, message: "OTP Sent successfully!" };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  };
  