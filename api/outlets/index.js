
'use strict'

const { Router } = require('express');
const { Outlet, MenuItem, Order, OrderItem } = require('../models');
const status_500 = require('../modules/status_500');


const DELIVERY_FEE = 1;


async function createOutlet(req, res) {

	try {

		// authentication
		if (!req.auth)
			return res.sendStatus(401);

		const data = req.body;
		const outlet = await Outlet.create(data);
		outlet.setUser(req.auth);
		await outlet.save();

		res.send({ id: outlet.id })

	} catch (err) {
		status_500(err, res);
	}
}


async function getOutlets(req, res) {

	try {
		const outlets = await Outlet.findAll();
		res.send(outlets);
	} catch (err) {
		status_500(err, res);
	}
}


async function getOutlet(req, res) {


	try {

		const { id } = req.params;

		const outlet = await Outlet.findOne({ where: { id }});
		
		if (!outlet)
			return res.sendStatus(404);

		const owner = await outlet.getUser();
		let isOwner = false;
		
		if (req.auth && req.auth.id === owner.id)
			isOwner = true;

		const items = await outlet.getMenuItems();

		const data = {
			isOwner,
			items,
			name: outlet.name,
			location: outlet.location
		}

		res.send(data); console.log(JSON.stringify(data, 0, 3));

	} catch (err) {
		status_500(err, res);
	}
}



async function addItemToOutlet(req, res) {

	try {

		// authentication
		if (!req.auth)
			return res.sendStatus(401);

		const { outletID } = req.params;
		const outlet = await Outlet.findOne({ where: { id: outletID }});

		if (!outlet)
			return res.status(404).send('Outlet id is invalid');

		const data = req.body;
		data.number_in_stock = 0;
		
		const item = await MenuItem.create(data);
		outlet.addMenuItem(item);
		await outlet.save();

		res.send({ id: item.id });

	} catch (err) {
		status_500(err, res)
	}
}


async function deleteItemFromOutlet(req, res) {

	try {

		// authentication
		if (!req.auth)
			return res.sendStatus(401);

		const { outletID, itemID } = req.params;
		const outlet = await Outlet.findOne({ where: { id: outletID }});

		// check ownership
		const owner = await outlet.getUser();
		if (owner.id !== req.auth.id)
			return res.sendStatus(403);

		await MenuItem.destroy({ where: { id: itemID }});
		res.send('OK');


	} catch (err) {
		status_500(err, res);
	}
}


async function updateStock(req, res) {

	try {

		// authentication
		if (!req.auth)
			return res.sendStatus(401);

		// check ownership
		const { outletID } = req.params;
		const outlet = await Outlet.findOne({ where: { id: outletID }});

		if (!outlet)
			return res.status(404).send('Outlet not found')

		const owner = await outlet.getUser();
		if (owner.id !== req.auth.id)
			return res.sendStatus(403); 

		// updating
		for (let i in req.body) {

			const { id, quantity } = req.body[i];

			const menuItem = await MenuItem.findOne({ where: { id } });

			if (menuItem) {
				menuItem.number_in_stock = (menuItem.number_in_stock || 0) + quantity;
				await menuItem.save();
			}
		}

		res.send('OK');


	} catch (err) {
		status_500(err, res);
	}
}


async function getOutletOrders(req, res) {

	try {

		// authentication
		if (!req.auth)
			return res.sendStatus(401);

		// check ownership
		const { outletID } = req.params;
		const outlet = await Outlet.findOne({ where: { id: outletID }});

		if (!outlet)
			return res.status(404).send('Outlet not found')

		const owner = await outlet.getUser();
		if (owner.id !== req.auth.id)
			return res.status(403).send('Youre not authorized to view this page');

		// get orders
		const orders = await outlet.getOrders();

		const data = [];

		for (let i in orders) {
			const order = orders[i];

			const orderItems = await order.getOrderItems();
			const items = [];

			for (let j in orderItems) {

				const orderItem = orderItems[j];
				const menuItem = await orderItem.getMenuItem();
				const outlet = await menuItem.getOutlet();

				if (outlet.id.toString() === outletID.toString()) {
					const { quantity } = orderItem;
					const { name, id } = menuItem;

					items.push({ quantity, name, id });
				}

			}

			const { total, id, status, time } = order;
			data.push({	id, status, total, time, items });
			
		}


		return res.send(data);

	} catch (err) {
		status_500(err, res)
	}
}



const route = Router();

route.post('/', createOutlet);
route.get('/', getOutlets);
route.get('/:id', getOutlet);
route.post('/:outletID/items/', addItemToOutlet);
route.delete('/:outletID/items/:itemID', deleteItemFromOutlet);
route.post('/:outletID/stock', updateStock);
route.get('/:outletID/orders', getOutletOrders);


module.exports = route;