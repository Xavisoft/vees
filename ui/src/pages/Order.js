
import React from 'react';
import Page from './Page';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import MultiplicationSign from '@material-ui/icons/Clear';
import TimeAgo from 'react-timeago';
import Component from '../components/Component';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions'


import request, { getRequestErrorMessage } from '../request';


// style

const divDataNotFetchedStyle = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: 'calc(var(--window-height) - var(--navbar-height))'
}

class Order extends Page {

	async fetchData() {

		const { id } = this.props.match.params;

		try {
			const response = await request.get(`/api/orders/${id}`);
			const data = response.data;

			await this._updateState({ ...data, dataFetched: true });
		} catch (err) {
			alert(getRequestErrorMessage(err));
		}
	}


	async openPhoneNumberModal() {
		await this._updateState({ phoneNumberModalOpen: true });
	}

	async closePhoneNumberModal() {
		await this._updateState({ phoneNumberModalOpen: false });
	}


	async updateStatusAfterSuccessfulPayment() {
		await this._updateState({ status: 'paid' })
	}


	_componentDidMount() {

		this.fetchData();
	}

	state = {

	}

	_render() {

		const { id } = this.props.match.params;
		const { items, total, time, status, phoneNumberModalOpen } = this.state;

		const retry = this.fetchData.bind(this);
		const openPhoneNumberModal = this.openPhoneNumberModal.bind(this);
		const closePhoneNumberModal = this.closePhoneNumberModal.bind(this);
		const updateStatusAfterSuccessfulPayment = this.updateStatusAfterSuccessfulPayment.bind(this);

		const dataNotFetchedJSX = (this.state.dataFetched) ? undefined : <div style={divDataNotFetchedStyle}>
			<Button onClick={retry} color="primary">RETRY</Button>
		</div>

		return dataNotFetchedJSX || <div>

			<PhoneNumberModal open={phoneNumberModalOpen} close={closePhoneNumberModal} orderID={id} updateStatus={updateStatusAfterSuccessfulPayment} />

			<h1>Order #{id}</h1>

			<Table>

				<TableBody>
					<TableRow>
						<TableCell>
						</TableCell>
						<TableCell>
						</TableCell>
					</TableRow>

					<TableRow>
						<TableCell>
							ITEMS
						</TableCell>
							{
								items.map(item => {

									return <p style={{ margin: 0, padding: '10px' }}>
										{item.quantity} <b>X</b> {item.name}
									</p>
								})
							}
						<TableCell>
						</TableCell>
					</TableRow>


					<TableRow>
						<TableCell>
							TOTAL
						</TableCell>
						<TableCell>
							${total.toFixed(2)}
						</TableCell>
					</TableRow>

					<TableRow>
						<TableCell>
							STATUS
						</TableCell>
						<TableCell style={{ textTransform: 'uppercase' }}>
							<code>{status}</code>
						</TableCell>
					</TableRow>

					<TableRow>
						<TableCell>
							CREATED
						</TableCell>
						<TableCell>
							<TimeAgo date={time} />
						</TableCell>
					</TableRow>

				</TableBody>

			</Table>
			
			{
				(status === 'not_paid') ? <Button variant="contained" size="large" color="primary" onClick={openPhoneNumberModal} fullWidth>
					PAY
				</Button> : undefined
			}


		</div>
	}
}

export default Order;



// local components

class PhoneNumberModal extends Component {


	state = {
		values: {}
	}


	async pay() {
		
		const { phone } = this.state.values;

		if (!phone)
			return alert('Phone number is required.');

		const orderID = this.props.orderID;
		const data = { phone };

		try {

			const response = await request.post(`/api/orders/${orderID}/mobile-money`, data);
			const { status } = response.data;

			alert('Payment Successful');
			this.props.updateStatus();

		} catch (err) {
			alert(getRequestErrorMessage(err));
		}
	}

	render() {


		const onChangeHandlerGenerator = this.onChangeHandlerGenerator.bind(this);
		const pay = this.pay.bind(this);

		const { phone } = this.state.values;
		const { open } = this.props;


		return <Dialog open={open}>
			<DialogTitle>ECOCASH/ONEMONEY</DialogTitle>
			
			<DialogContent>

				<TextField
					placeholder="Phone number"
					value={phone}
					onChange={onChangeHandlerGenerator('phone')}
				/>
			</DialogContent>

			<DialogActions>

				<Button variant="contained" color="primary" onClick={pay}>
					PAY
				</Button>

				<Button variant="text" color="primary" onClick={this.props.close}>
					close
				</Button>
			</DialogActions>
		</Dialog>
	}
}