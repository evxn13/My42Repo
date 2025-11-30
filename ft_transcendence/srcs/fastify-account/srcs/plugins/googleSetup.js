import fp 					from "fastify-plugin";
import fastifyOauth			from "@fastify/oauth2";

async function googleSetup(fastify, opts) {
	fastify.register(fastifyOauth, {
	  name: 'googleOAuth2',
	  scope: ['profile', 'email', 'openid'], //infos qu'on demande a google
	  credentials: {
		client: {
		  id: process.env.GOOGLE_CLIENT_ID,
		  secret: process.env.GOOGLE_CLIENT_SECRET,
		},
		auth: fastifyOauth.GOOGLE_CONFIGURATION,
	  },
	  startRedirectPath: '/auth/google',
	  callbackUri: 'https://'+ process.env.HOST_TRANSCENDENCE +':' + process.env.VITE_PORT_NGINX + '/api/auth/google/callback',
	});
}

export default fp(googleSetup);
