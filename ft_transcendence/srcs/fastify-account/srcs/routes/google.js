import jwt					from 'jsonwebtoken';
import fetch 				from 'node-fetch';

export default async function (fastify, opts) {
	fastify.get('/auth/google/callback', async (request, reply) => {
		try {
			// automatisation de recup code google -> exchange code contre id_token
			//SIKE on fait ca manuellement pour bypass state verif (fuk l'error: Invalid state)
			const code = request.query.code;
			if (!code)
				return reply.status(400).send({ success: false, error: "Code Google missing"});
			
			const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
				method: 'POST',
				headers: { 'Content-type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams({
					code,
					client_id: process.env.GOOGLE_CLIENT_ID,
					client_secret: process.env.GOOGLE_CLIENT_SECRET,
					redirect_uri: process.env.GOOGLE_REDIRECT_URI,
					grant_type: 'authorization_code'
				})
			});

			const tokenData = await tokenRes.json();
			if (!tokenData.id_token)
				return reply.status(400).send({ success:false, error: "id_token not received"});

			// Decoder les infos useur depuis l'id_token tmtc
			const decoded = jwt.decode(tokenData.id_token);
			if (!decoded || !decoded.email)
				return reply.status(400).send({ success:false, error: "Error decoding user"});

			let loweredEmail = decoded.email.toLowerCase();
			let loweredName = decoded.given_name.toLowerCase();

			//checking if google is already used (shouldnt be)
			const existingEmail = fastify.db.prepare("SELECT * FROM users WHERE email = ?").get(loweredEmail);
			//checking if name is already used
			let	existingUser = fastify.db.prepare("SELECT * FROM users WHERE username = ?").get(loweredName);
			while (existingUser)
			{
				loweredName += '1'; //adding '1' if already found
				existingUser = fastify.db.prepare("SELECT * FROM users WHERE username = ?").get(loweredName);
			}

			
			let user;
			if (!existingEmail) {
				const gogoleInsert = fastify.db.prepare("INSERT INTO users (username, email, password, genre, avatar) VALUES (?, ?, ?, ?, ?)");
				const result = gogoleInsert.run(
					loweredName,		// username
					decoded.email,				// email
					'Bonkers123',				// password (optionnel car Google)
					"Google",					// genre ou autre valeur par défaut
					decoded.picture
				); 
				user = { id: result.lastInsertRowid, username: result.loweredName, email: result.email };
			} else
				user = existingEmail;

			if (user.is2fa)
				return reply.redirect(`https://${process.env.HOST_TRANSCENDENCE}:${process.env.PORT_NGINX}/account/login?2faGoogle=true&id=${user.id}&email=${encodeURIComponent(user.email)}`);


			//Generate JWT token
			const payload = { email: user.email, username: user.username, id: user.id };
			const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

			return reply.redirect(`https://${process.env.HOST_TRANSCENDENCE}:${process.env.PORT_NGINX}/?token=${token}`);

		} catch (err) {
			console.error("❌ Google callback error:", err);
			return reply.status(500).send({ success: false, error: 'Error google.js' });
		}
	});
}
