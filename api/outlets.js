
'use strict'

const { Router } = require('express');
const { Outlet, MenuItem } = require('./models');
const status_500 = require('./modules/status_500')


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

		res.send(data);

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

		const item = await MenuItem.create(req.body);
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



const route = Router();

route.post('/', createOutlet);
route.get('/', getOutlets);
route.get('/:id', getOutlet);
route.post('/:outletID/items/', addItemToOutlet);
route.delete('/:outletID/items/:itemID', deleteItemFromOutlet);


module.exports = route;