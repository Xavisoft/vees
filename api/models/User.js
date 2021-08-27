
'use strict'

const { DataTypes, Model } = require('sequelize');
const { STRING, NUMBER } = DataTypes;


class User extends Model {

	static init(sequelize) {

		super.init({
			name: STRING,
			email: {
				type: STRING,
				unique: true,
			},
			password: STRING,
			location: STRING,
			auth_token: STRING,
			// auth_token_expires: NUMBER
		}, { sequelize, modelName: 'User'} );
	}
}


module.exports = User;