
import React from 'react';
import Page from './Page';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import request, { getRequestErrorMessage } from '../request';

class MyOrders extends Page {


	async fetchData() {

		try {
			const response = await request.get('/api/orders/personal');
			const orders = response.data;

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

		const notLoadedJSX = dataFetched ? undefined : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<Button variant="contained" color="primary" onClick={this.fetchData.bind(this)}>
				retry
			</Button>
		</div>

		return notLoadedJSX || <div>


			<h1>My Orders </h1>

			{
				orders.map(order => {
					return <div>
						<h3>Order #{ order.id }</h3>
						<h5 style={{ color: 'grey' }}>{order.status.toUpperCase()}</h5>
						<Button component={Link} to={`orders/${order.id}`}>
							view
						</Button>
					</div>
				})
			}
		</div>
	}
}


export default MyOrders;