
import React from 'react';
import Button from '@material-ui/core/Button';
import Page from './Page';
import Component from '../components/Component'
import Item from '../components/Item';
import request, { getRequestErrorMessage } from '../request';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import StockUpdateModal from '../components/StockUpdateModal';
import { Link } from 'react-router-dom'

class Outlet extends Page {



	async deleteItem(itemID) {

		const outletID = this.props.match.params.id;
		const url = `/api/outlets/${outletID}/items/${itemID}`;

		try {
			await request.delete(url);

			// rmoving from DOM
			const items = this.state.items.filter(item => {
				return item.id !== itemID;
			});

			await this._updateState({ items });

		} catch (err) {
			alert(getRequestErrorMessage(err));
		}
	}

	editItem(itemID) {
		alert('Feature coming very soon.')
	}

	async updateStock(stock) {

		const itemsMap = new Map();
		const items = this.state.items.map(item => {
			itemsMap.set(item.id.toString(), item);
			return item;
		});

		for (let i in stock) {

			const { id, quantity } = stock[i];
			const item = itemsMap.get(id.toString());

			if (item) {
				console.log({ quantity, number_in_stock: item.number_in_stock})
				item.number_in_stock += quantity;
			}
		}

		await this._updateState({ items });


	}


	async closeAddItemModal() {
		await this._updateState({ addItemModalOpen: false })
	}

	async openAddItemModal() {
		await this._updateState({ addItemModalOpen: true })
	}

	async openUpdateStockModal() {
		await this._updateState({ updateStockModalOpen: true })
	}

	async closeUpdateStockModal() {
		await this._updateState({ updateStockModalOpen: false });
	}

	async fetchData() {
		
		try {

			const id = this.props.match.params.id;
			const response = await request.get(`/api/outlets/${id}`);
			const { items, name, isOwner } = response.data;
			await this._updateState({ items, name, isOwner, dataFetched: true });

		} catch (err) {
			alert(getRequestErrorMessage(err))
		}
	}

	addItem(item) {
		const { items } = this.state;
		items.push(item);

		this._updateState({ items });
	}

	_componentDidMount() {
		this.fetchData();
	}

	state = {
		addItemModalOpen: false,
		updateStockModalOpen: false,
		items: []
	}

	_render() {

		const { items, dataFetched, isOwner, name, addItemModalOpen, updateStockModalOpen } = this.state;
		const outletID = this.props.match.params.id;

		const fetchData = this.fetchData.bind(this);
		const openAddItemModal = this.openAddItemModal.bind(this);
		const closeAddItemModal = this.closeAddItemModal.bind(this);
		const openUpdateStockModal = this.openUpdateStockModal.bind(this);
		const closeUpdateStockModal = this.closeUpdateStockModal.bind(this);
		const addItem = this.addItem.bind(this);
		const deleteItem = this.deleteItem.bind(this);
		const editItem = this.editItem.bind(this);
		const updateStock = this.updateStock.bind(this);

		let dataNotFetchedJSX, noItemsJSX;

		if (!dataFetched) {

			const noContentDivStyle = {
				display: 'flex', 
				justifyContent: 'center', 
				alignItems: 'center', 
				height: 'calc(var(--window-height) - var(--navbar-height))'
			}

			dataNotFetchedJSX = <div style={noContentDivStyle}>
				<h2>Failed to fetch data</h2>
				<br />

				<Button color="primary" variant="contained" onClick={fetchData}>
					retry
				</Button>
			</div>
		} else {

			if (items.length === 0) {
				noItemsJSX = <div>
					No items in this outlet.
				</div>
			}
		}

		return dataNotFetchedJSX || <div>

			<div className="center-align">
				<h1 style={{ margin: 0, padding: 0 }}>{name}</h1>
				<h3 style={{ color: 'grey', margin: 0, padding: 0 }}>Our Menu</h3>
			</div>


			{
				isOwner ?  <React.Fragment>

					<AddItemModal open={addItemModalOpen} close={closeAddItemModal} outletID={outletID} addItem={addItem} />
					<StockUpdateModal open={updateStockModalOpen} close={closeUpdateStockModal} items={items} outletID={outletID} updateStock={updateStock}  />

					<Button color="primary" onClick={openAddItemModal}>
						ADD ITEM
					</Button> 

					<Button color="primary" onClick={openUpdateStockModal}>
						UPDATE STOCK
					</Button>

					<Button color="primary" component={Link} to={`/outlets/${outletID}/orders`}>
						VIEW ORDERS
					</Button>

				</React.Fragment> : undefined
			}

			{
				noItemsJSX || items.map(item => {
					return <Item data={item} isOwner={isOwner} edit={editItem} delete={deleteItem} />
				})
			}

		
		</div>
	}
}

export default Outlet;



// local components

class AddItemModal extends Component {


	state = {
		values: {}
	}

	async submit() {

		const { picture, name, price } = this.state.values;

		if (!name)
			return alert('Name is required');

		if (!price)
			return alert('Price is required');


		if (!picture)
			return alert('Picture is required');

		const payload = { name, price, picture };
		const { outletID } = this.props;
		const url = `/api/outlets/${outletID}/items`;

		try {

			const response = await request.post(url, payload);
			const { id } = response.data;

			this.props.addItem({ ...payload, id, number_in_stock: 0 });

			// clear
			this._updateState({
				values: {
					picture: '',
					price: '',
					name: ''
				}
			})

			this.props.close();

		} catch (err) {
			alert(getRequestErrorMessage(err));
		}
	}

	static getDataURL(file) {

		const reader = new FileReader();

		return new Promise(resolve => {

			reader.onload = function() {
				resolve(reader.result);
			}

			reader.readAsDataURL(file);

		});
	}


	async onPictureChange(event) {
		
		const file = event.target.files[0];

		if (!file)
			return;

		const picture = await AddItemModal.getDataURL(file);
		const values = { ...this.state.values, picture }
		this._updateState({ values });
	}


	render() {

		const { name, price, picture } = this.state.values;
		const onChangeHandlerGenerator = this.onChangeHandlerGenerator.bind(this);
		const onPictureChange = this.onPictureChange.bind(this);
		const submit = this.submit.bind(this);

		const { open } = this.props;

		return <Dialog open={open}>

			<DialogTitle>ADD PRODUCT</DialogTitle>

			<DialogContent>

				<TextField
					fullWidth
					placeholder="Item name"
					className="text-field"
					value={name}
					onChange={onChangeHandlerGenerator('name')}
				/>

				<TextField
					fullWidth
					placeholder="Price"
					className="text-field"
					value={price}
					onChange={onChangeHandlerGenerator('price')}
					type="number"
				/>


				<div style={{ aspectRatio: '1', border: '1px #ccc solid' }}>
					<img src={picture} style={{ width: '100%', height: '100%' }} />
				</div>

				<input
					placeholder="Picture"
					className="text-field"
					onChange={onPictureChange}
					type="file"
					accept="image/*"
				/>

			</DialogContent>

			<DialogActions>
				<Button variant="contained" color="primary" onClick={submit}>ADD</Button>
				<Button color="primary" onClick={this.props.close}>CLOSE</Button>
			</DialogActions>

		</Dialog>
	}
}