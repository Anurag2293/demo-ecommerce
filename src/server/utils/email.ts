
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

export const sendOTPEmail = async (email: string, name: string, otp: string) => {
	try {
		const mailerSend = new MailerSend({
			apiKey: process.env.MAILERSEND_API_KEY ?? "",
		});
		const sentFrom = new Sender(
			"mailersend@trial-z3m5jgr0nwogdpyo.mlsender.net",
			"ECOMMERCE IO",
		);

		const recipients = [new Recipient(email, name)];

		const emailParams = new EmailParams()
			.setFrom(sentFrom)
			.setTo(recipients)
			.setReplyTo(sentFrom)
			.setSubject("One Time Password for verifying!")
			.setHtml(
				`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
				<html xmlns="http://www.w3.org/1999/xhtml">
				<head>
					<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
					<title>Welcome to Ecommerce IO!</title>
					<style type="text/css">
					/* Basic Reset for Email Clients */
					body {
						margin: 0;
						padding: 0;
						font-family: Arial, sans-serif;
					}
					table {
						border-collapse: collapse;
						width: 100%;
					}
					td {
						padding: 10px;
					}

					/* Template Styling */
					.container {
						background-color: #f4f4f4;
						padding: 20px;
					}
					.content {
						background-color: #fff;
						padding: 20px;
						border-radius: 5px;
						text-align: center;
					}
					strong {
						font-size: 20px;
						color: #333;
					}
					h2 {
						color: #f7c800; /* Ecommerce IO yellow */
						margin: 10px 0;
					}
					p {
						font-size: 16px;
						line-height: 1.5;
					}
					</style>
				</head>
				<body>
					<table class="container">
						<tr>
							<td>
								<table class="content">
									<tr>
										<td>
											<div>
												<strong>Hi, ${name}</strong>
												<h2>Welcome to Ecommerce IO!</h2>
												<p>Here's your One-Time Password (OTP) for completing signup: ${otp}</p>
											</div>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</body>
				</html>
			`,)
			.setText("This is the text content");

		await mailerSend.email.send(emailParams);

		return { success: true, message: "OTP Sent successfully!" };
	} catch (error) {
		return { success: false, message: (error as Error).message };
	}
};
