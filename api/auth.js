
'use strict';

const { User } = require('./models');
const auth = require('./modules/auth/backend');


async function getHashedPasswordByUsername(email) {

	const user = await User.findOne({ where: { email }});

	if (!user)
		return null

	return user.password;

}


async function getUserInfoByAuthToken(auth_token) {

	const user = await User.findOne({ where: { auth_token } });
	return user;

}

async function updateAuthTokenInDataStore(arg) {

	const { new_auth_token, old_auth_token, username } = arg;

	const user = await User.findOne({
		where: {
			$or: [
				{
					email: username || ''
				},
				{
					auth_token: old_auth_token || ''
				}
			]
		} 
	});

	user.auth_token = new_auth_token;
	await user.save();

}


async function removeAuthTokenFromDataStore(auth_token) {

	const user = await User.findOne({ where: { auth_token } });

	if (user) {
		console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
		user.auth_token = null;
		await user.save();
	}

	console.log('========================================================================')

}



module.exports = function init(app) {
	auth({
		app,
		route: '/api/login-credentials',
		getHashedPasswordByUsername,
		getUserInfoByAuthToken,
		updateAuthTokenInDataStore,
		removeAuthTokenFromDataStore
	})
}