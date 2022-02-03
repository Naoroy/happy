'use strict';

const Hapi = require('@hapi/hapi');
const Hoek = require('@hapi/hoek');
const Vision = require('@hapi/vision');
const Cookie = require('@hapi/cookie');
const Handlebars = require('handlebars');


const init = async () => {
	const server = Hapi.server({
		port: 3000,
		host: 'localhost'
	});

	await server.register(Vision);
	await server.register(Cookie);

	server.views({
		engines: { html: Handlebars },
		relativeTo: __dirname,
		path: 'templates'
	});

	server.auth.strategy('base', 'cookie', {
		cookie: {
			password: 'secret',
			ttl: 60 * 60 * 1000 // One hour
		},
	});

	server.route({
		method: 'GET',
		path: '/',
		handler: rootCtrl
	});

	server.route({
		method: 'POST',
		path: '/login',
		config: {
			validate: {
				payload: {
					email: Joi.string().email().required(),
					password: Joi.string().min(2).max(200).required()
				}
			}
		},
		handler: loginCtrl
	});

	await server.start();
	console.log('Server running on %s', server.info.uri);
};

function rootCtrl(request, h) {
	return h.view('index');
	//return 'Hello World';
}

function loginCtrl(request, h) {
	return h.view('index');
}

process.on('unhandledRejection', (err) => {
	console.log(err);
	process.exit(1);
})

init();
