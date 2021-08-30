
'use strict'


const { Router } = require('express');
const { Outlet, MenuItem, Order, OrderItem } = require('./models');
const uuid = require('uuid').v4;
const status_500 = require('./modules/status_500');
const { Paynow } = require('paynow')


const DELIVERY_FEE = 1;

const PAYNOW_INTEGRATION_ID = '11223'
const	PAYNOW_INTEGRATION_KEY = 'aff446cf-4618-4f92-a780-41662ec699fb';


function delay(millis) {
	return new Promise(resolve => {
		setTimeout(resolve, millis)
	})
}

function detectMobileMoneyMethod(phone) {

	phone = `0${parseInt(phone)}`;

	const firstThree = phone.substring(0, 3);

	switch (firstThree) {
		case '071':
			return 'onemoney';
		case '073':
			return 'telecash';
		case '077':
		case '078':
			return 'ecocash'
		default:
			return null;
	}
}


async function createOrder(req, res) {

	try {


		// authentication
		if (!req.auth)
			return res.status(400).send('You need to login to create an order');


		// adding items to order

		const order = await Order.create({
			status: 'not_paid',
			time: Date.now()
		});

		let total = 0;
		const outletMap = new Map();

		for (let i in req.body) {

			const { id, quantity } = req.body[i];

			const item = await MenuItem.findOne({ where: { id }});

			if (!item) {
				return res.status(400).send(`Item with ID of ${id} not found`);
			}

			const orderItem = await OrderItem.create({ quantity });
			orderItem.setMenuItem(item);
			await orderItem.save();

			total+= item.price * quantity;
			order.addOrderItem(orderItem);

			const outlet = await item.getOutlet();
			const outletID = outlet.id;

			if (!outletMap.get(outletID)) {
				outlet.addOrder(order);
				outletMap.set(outletID, outlet);
			}

		}

		order.total = total + DELIVERY_FEE;
		await order.save();

		// save outlets
		const array = Array.from(outletMap);
		for (let i in array) {
			const [ outletID, outlet ] = array[i];
			await outlet.save(); 
		}

		const user = req.auth;
		user.addOrder(order);
		await user.save();

		return res.send({ id: order.id });

	} catch (err) {
		status_500(err, res);
	}
}


async function retrieveOrder(req, res) {

	try {


		// authentication
		if (!req.auth)
			return res.status(400).send('You need to login to create an order');

		// retrieve order
		const { id } = req.params;
		const order = await Order.findOne({ where: { id }});

		if (!order)
			return res.status(404).send('Order number not found');

		const orderItems = await order.getOrderItems();
		const items = [];

		for (let i in orderItems) {
			const { quantity } = orderItems[i];
			const menuItem = await orderItems[i].getMenuItem();
			const { name, id } = menuItem;
			items.push({ name, id, quantity });
		}

		const { status, time, total } = order;
		const data = { id, status, time, total , items };
		res.send(data)

	} catch (err) {
		status_500(err, res);
	}
}


async function pay(req, res) {


	try {

		const paynow = new Paynow(PAYNOW_INTEGRATION_ID, PAYNOW_INTEGRATION_KEY);
		const orderID = req.params.id;
		const payment  = paynow.createPayment(uuid(), 'xaviermukodi@gmail.com');
		
		const order = await Order.findOne({ where: { id: orderID }});

		if (!order)
			return res.status(404).send('Order not found')

		payment.add(`Order#${orderID}`, order.total);

		const phone = req.body.phone;
		const mobileMoneyMethod = detectMobileMoneyMethod(phone);

		const paymentDetails = await paynow.sendMobile(payment, phone, mobileMoneyMethod);

		if (!paymentDetails.success)
			throw new Error(JSON.stringify(paymentDetails));

		// start polling for 2 minutes
		const { pollUrl } = paymentDetails;
		let timedOut = true;

		for (let i = 0; i < 12; i++) {

			await delay(10000);

			const transactionStatus = await paynow.pollTransaction(pollUrl);
			const { status } = transactionStatus;

			if (status === 'paid') {

				order.status = 'paid';
				await order.save();

				timedOut = false;
				break;

			} else if (status === 'cancelled') {

				timedOut = false;
				break;
			}

		}

		if (timedOut)
			return res.status(400).send('Payment not made');

		res.send();

	} catch (err) {
		status_500(err, res);
	}
}


async function getMyOrders(req, res) {
	
	try {

		// authentication
		if (!req.auth)
			return res.status(400).send('You need to login to create an order');

		const orders = await req.auth.getOrders();

		res.send(orders);

	} catch (err) {
		status_500(err, res);
	}
}


async function updateStatus(req, res) {

	try {

		// authentication
		if (!req.auth)
			return res.status(400).send('You need to login to create an order');

		const { id } = req.params;
		const order = await Order.findOne({ where: { id }});

		if (!order)
			return res.status(404).send('Order number not found');

		order.status = req.body.status;
		await order.save();

		res.send();

	} catch (err) {
		status_500(err, res);

	}
}



const router = Router();

router.post('/', createOrder);
router.get('/personal', getMyOrders);
router.get('/:id', retrieveOrder);
router.post('/:id/mobile-money', pay);
router.post('/:id/status', updateStatus);

module.exports = router;
