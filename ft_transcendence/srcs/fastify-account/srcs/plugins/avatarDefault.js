import fp from 'fastify-plugin';
import fs from 'fs';

async function avatarDefaultPlugin(fastify, opts) {
	const defaultAvatarPath = '/lib/transcendence/louigi.png';

	try {
    	const imageBuffer = fs.readFileSync(defaultAvatarPath);
    	const base64 = imageBuffer.toString('base64');

    	fastify.decorate('defaultAvatar', base64);
    	console.log("✅ Default avatar load in memory");
  	} catch (err) {
    	console.error("❌ Impossible to read default avatar :", err);
	}
}

export default fp(avatarDefaultPlugin);
