import fp from 'fastify-plugin';

const MAX_AVATAR_SIZE = 300 * 1024; // 300 KB
const ALLOWED_TYPES = ['image/png', 'image/jpeg'];

async function avatarValidator(fastify) {
  fastify.decorate('validateAvatar', (avatar) => {
  const size = Buffer.byteLength(avatar, 'utf8'); 
  let error;
  if (size > MAX_AVATAR_SIZE)
      error = new Error('Avatar too big (max 300KB).');
      error.statusCode = 400;
      throw error;

    if (!avatar.startsWith('data:image/'))
      error = new Error("Invalid avatar format.");
      error.statusCode = 400;
      throw error;

    const isValidFormat = /^data:image\/(png|jpeg);base64,/.test(avatar); // Regex améliorée pour accepter PNG et JPEG

    if (!isValidFormat)
      error = new Error('ONLY PNG ET JPEG COMPATIBLES.');
      error.statusCode = 400;
      throw error;

  });
}
export default fp(avatarValidator);
