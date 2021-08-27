
'use strict'

const { DataTypes, Model } = require('sequelize');
const { STRING, NUMBER } = DataTypes;


class Outlet extends Model {

	static init(sequelize) {

		super.init({
			name: STRING,
			location: STRING
		}, { sequelize, modelName: 'Outlet' })
	}
}


module.exports = Outlet;