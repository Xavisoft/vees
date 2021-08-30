
'use strict';

const User = require('./User');
const Outlet = require('./Outlet');
const MenuItem = require('./MenuItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const { Sequelize } = require('sequelize');


// operatorsAliases
const operatorsAliases = {
	$or: Sequelize.Op.or,
	$and: Sequelize.Op.and
}


// initializing models
const sequelize = new Sequelize(`sqlite::${__dirname}/db.sqlite`, { operatorsAliases });

User.init(sequelize);
Outlet.init(sequelize);
MenuItem.init(sequelize);
Order.init(sequelize);
OrderItem.init(sequelize);


Outlet.belongsTo(User);
User.hasMany(Outlet);

MenuItem.belongsTo(Outlet);
Outlet.hasMany(MenuItem);


Order.belongsTo(User)
Outlet.hasMany(Order)
User.hasMany(Order)
Order.hasMany(OrderItem)
OrderItem.hasOne(MenuItem)







// connecting to the database
sequelize.sync({});

module.exports = {
	User,
	Outlet,
	MenuItem,
	Order,
	OrderItem
}