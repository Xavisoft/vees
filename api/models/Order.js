
// status
// outlet
// user
// time
// time
// id


// status
// 	not_paid
// 	pending
// 	prepared
// 	delivered
// 	delivery_confirmed

'use strict'


const { DataTypes, Model } = require('sequelize');
const { STRING, NUMBER } = DataTypes;


class Order extends Model {

	static init(sequelize) {

		super.init({
			status: STRING,
			time: NUMBER,
			total: NUMBER
		}, { sequelize, modelName: 'Order' })
	}
}


module.exports = Order;