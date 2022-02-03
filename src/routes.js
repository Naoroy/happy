const users = require('../.data/users.js');


const routes = [{
    method: 'GET',
    path: '/',
    handler: rootHandler
}, {
    method: 'GET',
    path: '/login',
    handler: (_, h) => h.view('login'),
    options: { auth: false }
}, {
    method: 'POST',
    path: '/login',
    handler: loginHandler,
    options: {
        auth: {
            mode: 'try'
        }
    }
}, {
    method: 'GET',
    path: '/account',
    handler: (_,__) => 'account'
}];

function rootHandler(request, h) {
	return h.view('index');
}

async function loginHandler(request, h) {
	const { email, password } = request.payload;
	const account = users.find((user) => (user.email === email));

	if (!account) {
		return h.redirect('/login');
	}
	request.cookieAuth.set({ id: account.id })
	return h.redirect('/');
}

module.exports = routes;
