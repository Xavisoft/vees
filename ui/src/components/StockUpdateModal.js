

import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Component from './Component';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';


const items = [
	{
		id: '1',
		name: 'Item 1'
	},
	{
		id: '3',
		name: 'Item 2'
	},
	{
		id: '3',
		name: 'Item 3'
	}
]


class StockUpdateModal extends Component {

	addItemToList() {

		const { itemID, quantity } = this.state.values;

		if (!itemID)
			return alert('Select item.');
		
		if (!quantity)
			return alert('Add quantity.');

		// get item from item list
		let item;

		for (let i in items) {
			if (items[i].id === itemID) {
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
			selectedItem.quantity += quantity;
		} else {
			selectedItems.push({
				id: itemID,
				quantity,
				name: item.name
			});
		}

		const  values = { itemID: '', quantity: '' };
		this._updateState({ selectedItems, values });

	}

	state = {
		values: {},
		selectedItems: []
	}

	render() {

		const { itemID, quantity } = this.state.values;
		const { open } = this.state; 

		const onChangeHandlerGenerator = this.onChangeHandlerGenerator.bind(this);
		const addItemToList = this.addItemToList.bind(this)

		return <Dialog open={open}>

			<DialogTitle>UPDATE STOCK</DialogTitle>

			<DialogContent>
				<TextField
					id="sel-menu-item"
					label="Select item"
					select
					fullWidth
					value={itemID}
					onChange={onChangeHandlerGenerator('itemID')}
				>
					{
						items.map(item => {
							return <MenuItem value={item.id}>{item.name}</MenuItem>
						})
					}
				</TextField>

				<Grid container spacing={3}>
					<Grid item xs={8}>
						<TextField
							id="txt-quantity"
							placeholder="Qty"
							fullWidth
							value={quantity}
							onChange={onChangeHandlerGenerator('quantity')}
						/>
					</Grid>
					<Grid item xs={4}>
						<Button color="primary" fullWidth onClick={addItemToList}>ADD</Button>
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
				<Button>UPDATE</Button>
				<Button>CLOSE</Button>
			</DialogActions>

		</Dialog>
	}
}



export default StockUpdateModal;