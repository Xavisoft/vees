

'use strict';


const express = require('express');


const app = express();

// middlewares
const auth = require('./auth');

app.use(express.json({ 'limit': '20mb' }));
auth(app);


// routes
const users = require('./users');
const outlets = require('./outlets');

app.use('/api/users', users);
app.use('/api/outlets', outlets);

const httpServer = app.listen(8080, function () {
	console.log('SERVER STARTED');
});

