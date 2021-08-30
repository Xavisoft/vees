

import React from 'react';
import Page from './Page';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import request, { getRequestErrorMessage } from '../request';



class OutletOrders extends Page {


	async updateOrderStatus(event) {

		const orderID = event.currentTarget.getAttribute('data-order-id');
		const status = event.currentTarget.value;

		const data = { status }

		try {

			const response = await request.post(`/api/orders/${orderID}/status`, data);

			// update status on the order
			const orders = this.state.orders.map(order => {

				if (order.id.toString() === orderID.toString())
					order.status = status;

				return { ...order };

			});

			this._updateState({ orders });

		} catch (err) {
			alert(getRequestErrorMessage(err));
		}
	}

	async fetchData() {

		const outletID = this.props.match.params.id;

		try {
			const response = await request.get(`/api/outlets/${outletID}/orders`);
			const orders = response.data; console.log(orders);

			this._updateState({ orders, dataFetched: true })
		} catch(err) {
			alert(getRequestErrorMessage(err))
		}
	}


	_componentDidMount() {
		this.fetchData();
	}

	state = {
		orders: []
	}

	_render() {


		const { orders, dataFetched } = this.state;

		const fetchData = this.fetchData.bind(this);
		const updateOrderStatus = this.updateOrderStatus.bind(this);

		const notLoadedJSX = dataFetched ? undefined : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<Button variant="contained" color="primary" onClick={this.fetchData.bind(this)}>
				retry
			</Button>
		</div>

		return notLoadedJSX || <div> 

			<h1>Orders</h1>

			{
				orders.map(order => {

					return <div>
						<h4>Order #1</h4>

						<Table>
							<TableBody>
								<TableRow>
									<TableCell></TableCell>
									<TableCell>
										
									</TableCell>
								</TableRow>

								<TableRow>
									<TableCell>ITEMS</TableCell>
									<TableCell>
										{
											order.items.map(item => {
												return <p>
													{item.quantity} <b>X</b> {item.name}
												</p>
											})
										}
									</TableCell>
								</TableRow>

								<TableRow>
									<TableCell>STATUS</TableCell>
									<TableCell>
										<select data-order-id={order.id} style={{ width: '100%',  }} value={order.status} onChange={updateOrderStatus}>
											<option value="not_paid" disabled>NOT PAID</option>
											<option value="paid">PAID</option>
											<option value="prepared">PREPARED</option>
											<option value="delivered">DELIVERED</option>
										</select>

									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				})
			}
		</div>

	}
}

export default OutletOrders;