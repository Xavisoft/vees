
'use strict'

const { DataTypes, Model } = require('sequelize');
const { STRING, NUMBER } = DataTypes


class OrderItem extends Model {


	static init(sequelize) {

		super.init({
			quantity: NUMBER
		}, { sequelize, modelName: 'OrderItem'} );
	}
}


module.exports = OrderItem;
