export async function postToFastify(route, data) {
	try {
		const res = await fetch(`https://fastify-account:${process.env.PORT_FASTIFY}${route}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
		return await res.json();
	} catch (err) {
		console.error("❌ postToFastify error:", err.message);
		return null;
	}
}

