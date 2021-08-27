
'use strict';

const constants = require('./constants');


function writeAuthTokenToLocalStorage(token) {
	window.localStorage.setItem(constants.HEADER_NAME, token || '');
}

function readAuthTokenFromLocalStorage() {
	return window.localStorage.getItem(constants.HEADER_NAME);
}

function setAuthTokenHeader(config) {
	const token = readAuthTokenFromLocalStorage();
	config.headers[constants.HEADER_NAME] = token;
	return config;
}


function storeAuthTokenHeaderFromResponse(response) {

	const token = response.headers[constants.HEADER_NAME];
	writeAuthTokenToLocalStorage(token);
	return response;

}

function storeAuthTokenHeaderFromErrorResponse(error) {

	const token = error.response.headers[constants.HEADER_NAME];
	writeAuthTokenToLocalStorage(token);

	throw error;

}


function init(options) {

	const {
		axios
	} = options;

	try {

		axios.interceptors.request.use(setAuthTokenHeader);
		axios.interceptors.response.use(storeAuthTokenHeaderFromResponse, storeAuthTokenHeaderFromErrorResponse);

	} catch (err) {
		throw err;
	}

}


module.exports = init