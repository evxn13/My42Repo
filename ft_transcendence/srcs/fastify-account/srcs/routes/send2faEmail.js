import speakeasy from "speakeasy";
import nodemailer from "nodemailer";

export default async function (fastify, opts) {
	fastify.post("/send2faEmail", async (request, reply) => {
		const emailToSend = request.body.email;

		const user = fastify.db.prepare("SELECT * FROM users WHERE email = ?").get(emailToSend);
		if (!user || !user.secret2fa)
			return reply.status(403).send({ error: "User or 2FA not found"});

		const code = speakeasy.totp({
			secret: user.secret2fa,
			encoding: "base32",
		});

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			},
		});

		const info = await transporter.sendMail({
			from:`"Transcendence" <${process.env.MAIL_USER}>`,
			to: user.email,
			subject: "Code 2FA",
			html: `<h1>This is you 2FA code :</h1><h2>${code}</h2>`,
		});

		reply.send({ success: true, message: "code sent by email"});
	});
}
