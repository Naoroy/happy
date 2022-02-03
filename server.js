'use strict';

const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const Cookie = require('@hapi/cookie');
const Handlebars = require('handlebars');
const Hoek = require('@hapi/hoek');
const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const routes = require('./src/routes');
const users = require('./.data/users.js');


const init = async () => {
	const server = Hapi.server({
		port: 3000,
		host: 'localhost'
	});

	await server.register(Vision);
	await server.register(Cookie);
	//server.validator(Joi);

	server.views({
		engines: { html: Handlebars },
		relativeTo: __dirname,
		path: 'templates'
	});

	server.auth.strategy('session', 'cookie', {
        cookie: {
            name: 'happy',
            password: 'supermegahypersecretcookiepassword',
            isSecure: false
        },
        redirectTo: '/login',
        validateFunc: async (request, session) => {
            const account = users.find((user) => (user.id === session.id));

            if (!account) {
                return { valid: false };
            }

            return { valid: true, credentials: account };
        }
    });

	server.auth.default('session');
	server.route(routes)

	await server
		.start()
		.then(() => console.log('Server running on %s', server.info.uri));
};

process.on('unhandledRejection', (err) => {
	console.log(err);
	process.exit(1);
})


init();
