
"use strict"

const bcrypt = require('bcrypt');
const uuid = require('uuid').v4;
const constants = require('./constants');

let getUserInfoByAuthToken;
let getHashedPasswordByUsername;
let updateAuthTokenInDataStore;
let removeAuthTokenFromDataStore;
let logError;


async function emptyFunction() {}


async function middleware(req, res, next) {

	try {

		// extract auth token
		const auth_token = req.headers[constants.HEADER_NAME];

		if (!auth_token) {
			console.log('AUTH: no token');
			req.auth = null;
			return next();
		}

		
		// get user info by auth_token
		const userInfo = await getUserInfoByAuthToken(auth_token);

		if (userInfo === null) {
			console.log('AUTH: invalid token');
			req.auth = null;
			return next();
		}

		req.auth = userInfo;

		// update auth token
		const new_auth_token = uuid();
		setAuthToken(res, new_auth_token);
		await updateAuthTokenInDataStore({ new_auth_token, old_auth_token: auth_token });

		next();

	} catch (err) {
		res.sendStatus(500);
		logError(err);
	}

}

async function setAuthToken(res, token) {
	res.new_auth_token = token
	res.header(constants.HEADER_NAME, token);
} 

async function loginEndpointHandler(req, res) {
	
	try {

		const { username, password } = req.body; // extract posted data

		if (!username)
			return res.status(400).send('Username is required');

		if (!password)
			return res.status(400).send('Password is required');

		const hashedPassword = await getHashedPasswordByUsername(username); // extract hashedPassword 

		// validating credentials
		if (hashedPassword === null)
			return res.status(400).send('Invalid credentials');

		const passwordIsValid = await bcrypt.compare(password, hashedPassword);

		if (!passwordIsValid)
			return res.status(400).send('Invalid credentials');

		// setting auth token header
		const new_auth_token = uuid();
		await updateAuthTokenInDataStore({ username, new_auth_token });
		setAuthToken(res, new_auth_token);

		return res.send('OK');

	} catch (err) {
		res.sendStatus(500);
		logError(err)
	}
}


async function logoutEndpointHandler(req, res) {

	try {
		const auth_token = res.new_auth_token;
		await removeAuthTokenFromDataStore(auth_token);

		res.sendStatus(200);
	} catch (err) {
		res.sendStatus(500);
		logError(err);
	}
}

function init (options) {

	const { 
		app, 
		route='/api/login', 
		getHashedPasswordByUsername:_getHashedPasswordByUsername,
		getUserInfoByAuthToken: _getUserInfoByAuthToken,
		updateAuthTokenInDataStore:_updateAuthTokenInDataStore,
		removeAuthTokenFromDataStore:_removeAuthTokenFromDataStore,
		logError: _logError
	} = options;

	getHashedPasswordByUsername = _getHashedPasswordByUsername || emptyFunction;
	updateAuthTokenInDataStore = _updateAuthTokenInDataStore || emptyFunction;
	getUserInfoByAuthToken = _getUserInfoByAuthToken || emptyFunction;
	removeAuthTokenFromDataStore = _removeAuthTokenFromDataStore || emptyFunction
	logError = _logError || ((err) => { console.log(err) });

	app.use(middleware);

	if (route) {
		app.post(route, loginEndpointHandler);
		app.delete(route, logoutEndpointHandler)
	}

}


module.exports = init;