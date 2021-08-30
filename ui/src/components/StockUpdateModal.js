

import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Component from './Component';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ChevronRight from '@material-ui/icons/Add';
// import MenuItem from '@material-ui/core/MenuItem';

import request, { getRequestErrorMessage } from '../request';


class StockUpdateModal extends Component {


	async update() {

		const data = this.state.selectedItems || []

		if (data.length === 0)
			return alert('Please enter some data');

		try {
			const outletID = this.props.outletID;
			const url = `/api/outlets/${outletID}/stock`;
			await request.post(url, data);

			await this.props.close();
			await this.props.updateStock(data);
			
		} catch (err) {
			alert(getRequestErrorMessage(err))
		}
	}

	addItemToList() {

		const { itemID, quantity } = this.state.values;
		const { items } = this.props;

		if (!itemID)
			return alert('Select item.');
		
		if (!quantity)
			return alert('Add quantity.');

		// get item from item list
		let item;

		for (let i in items) {
			if (items[i].id.toString() === itemID.toString()) {
				item = items[i];
				break;
			}
		}

		if (!item)
			return;




		// update selectedItems
		const { selectedItems } = this.state;
		let selectedItem;

		for (let i in selectedItems) {
			if (selectedItems[i].id === itemID) {
				selectedItem = selectedItems[i];
				break;
			}
		}


		if (selectedItem) {
			selectedItem.quantity += parseInt(quantity);
		} else {
			selectedItems.push({
				id: itemID,
				quantity: parseInt(quantity),
				name: item.name
			});
		}

		const  values = { itemID: '', quantity: '' };
		this._updateState({ selectedItems, values });
		// document.getElementById('sel-menu-item').parentNode.querySelector('input').previousSibling.innerHTML = ''; // very hacky

	}

	state = {
		values: {},
		selectedItems: []
	}

	render() {

		const { itemID, quantity } = this.state.values;
		const { open, items=[] } = this.props; 

		const onChangeHandlerGenerator = this.onChangeHandlerGenerator.bind(this);
		const addItemToList = this.addItemToList.bind(this);
		const update = this.update.bind(this);

		return <Dialog open={open}>

			<DialogTitle>UPDATE STOCK</DialogTitle>

			<DialogContent>


				<Grid container spacing={3}>

					<Grid item xs={6}>

						<select
							id="sel-menu-item"
							value={itemID || ''}
							onChange={onChangeHandlerGenerator('itemID')}
							style={{
								width: '100%',
								borderStyle: 'none none solid none',
								padding: '10px 0',
								background: 'transparent'
							}}
						>
							<option value="" disabled>Select Item</option>

							{
								items.map(item => {
									return <option value={item.id}>{item.name}</option>
								})
							}
						</select>

					</Grid>

					<Grid item xs={4}>
						<TextField
							id="txt-quantity"
							placeholder="Qty"
							fullWidth
							value={quantity || ''}
							onChange={onChangeHandlerGenerator('quantity')}
						/>
					</Grid>
					<Grid item xs={2}>
						<Button color="primary" fullWidth onClick={addItemToList}>
							<ChevronRight />
						</Button>
					</Grid>
				</Grid> 

				<hr />

				{
					this.state.selectedItems.map(item => {
						return <div>
							{item.quantity} <strong><bigger>X</bigger></strong> {item.name}
						</div>
					})
				}

			</DialogContent>

			<DialogActions>
				<Button onClick={update}>UPDATE</Button>
				<Button onClick={this.props.close}>CLOSE</Button>
			</DialogActions>

		</Dialog>
	}
}



export default StockUpdateModal;