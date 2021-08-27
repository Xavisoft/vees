

const { Router } = require('express');
const status_500 = require('./modules/status_500');
const { User } = require('./models');
const bcrypt = require('bcrypt');

async function createUser(req, res) {

	try {

		// check if email is already taken
		const data = req.body;
		data.email = data.email.toLowerCase();
		data.password = await bcrypt.hash(data.password, 10);
		
		const emailUser = await User.findOne({ where: { email: data.email }});

		if (emailUser)
			return res.status(409).send('Email already in use');


		const user = await User.create(data);
		res.sendStatus(200);

	} catch (err) {
		status_500(err, res);
	}
}


const route = Router();
route.post('/', createUser);

module.exports = route;