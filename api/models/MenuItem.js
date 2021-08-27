
'use strict'

const { DataTypes, Model } = require('sequelize');
const { STRING, NUMBER } = DataTypes;


class MenuItem extends Model {


	static init(sequelize) {

		super.init({
			name: {
				type: STRING,
				unique: true
			},
			price: NUMBER,
			number_in_stock: {
				type: NUMBER,
				default: 0
			},
			picture: STRING
		}, { sequelize, modelName: 'MenuItem' })
	}
}


module.exports = MenuItem;