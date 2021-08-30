

'use strict';
console.clear();


const express = require('express');


const app = express();

// middlewares
const auth = require('./auth');
const cors = require('cors');

const corsOptions = {
	origin: "null",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	preflightContinue: false,
	optionsSuccessStatus: 200,
	credentials: true,
	allowedHeaders: 'Content-Type,openstack-xavisoft-auth-token',
	exposedHeaders: 'openstack-xavisoft-auth-token'
}

app.options('*', cors(corsOptions))
app.use(express.static('static'));
app.use(cors(corsOptions))
app.use(express.json({ 'limit': '20mb' }));
auth(app);


// routes
const users = require('./users');
const outlets = require('./outlets');
const orders = require('./orders');

app.use('/api/users', users);
app.use('/api/outlets', outlets);
app.use('/api/orders', orders);


app.use('*', function(req, res) {
	res.sendFile(`${__dirname}/static/index.html`);
});

const httpServer = app.listen(8080, function () {
	console.log('SERVER STARTED');
});

