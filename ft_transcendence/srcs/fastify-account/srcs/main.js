/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tpicoule <tpicoule@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/01/27 12:53:11 by isibio            #+#    #+#             */
/*   Updated: 2025/06/30 17:23:22 by tpicoule         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import Fastify					from "fastify";
import fastifyCors				from "@fastify/cors";
import fastifyJwt				from "@fastify/jwt";
import accountFieldCheck		from "/lib/transcendence/accountFieldCheckJS/accountFieldCheck.js";
import Autoload					from "@fastify/autoload";
import { fileURLToPath }		from "url";
import { dirname, join }		from "path";
import https					from 'https';
import fs						from 'fs';
import path						from 'path';
import bcrypt					from "bcryptjs";

const fastify = Fastify(
{
	logger: false,
	https:
	{
		key: fs.readFileSync(path.resolve('/var/transcendence-nginx/ssl/transendence-selfsigned.key')),
		cert: fs.readFileSync(path.resolve('/var/transcendence-nginx/ssl/transendence-selfsigned.crt'))
	}
});

// ────────────────────────────────────────────
// FASTIFY AUTOLOADERS
// ────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

fastify.register(Autoload, {
	dir: join(__dirname, 'plugins'),
	forceESM: true,
});

fastify.register(Autoload, {
	dir: join(__dirname, "routes"),
	forceESM: true,
});

fastify.register(Autoload, {
  dir: join(__dirname, "chat/routes"),
  forceESM: true,
});

// ────────────────────────────────────────────
// SETUP FASTIFY
// ────────────────────────────────────────────

console.log("Registration plugin CORS...");
await fastify.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}, (err) => {
  if (err) {
    console.log("❌ Error while registration plugin CORS:", err);
  } else {
    console.log("✅ Plugin CORS registrated with success");
  }
});

// ────────────────────────────────────────────
// START
// ────────────────────────────────────────────

fastify.listen(
  { port: process.env.PORT_FASTIFY, host: '0.0.0.0' },
  (err) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`✅ Fastify server listening port ${process.env.PORT_FASTIFY}`);
  }
);
