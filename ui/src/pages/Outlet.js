
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

	async editItem(itemID) {
		let itemToBeEdited;
		const itemModalMode = 'edit';

		for (let i in this.state.items) {
			const item = this.state.items[i];

			if (item.id.toString() === itemID.toString()) {
				itemToBeEdited = item;
				break;
			}
		}

		if (itemToBeEdited) {
			await this._updateState({ itemToBeEdited, itemModalMode });
			await this.openItemModal();
		}
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


	async closeItemModal() {
		await this._updateState({ addItemModalOpen: false })
	}

	async openItemModal() {
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

	async addItem(item) {
		const { items } = this.state;
		items.push(item);

		await this._updateState({ items });
	}

	async updateItem(itemID, updates) {

		const items = this.state.items.map(item => {

			if (item.id.toString() === itemID.toString()) {

				for (let prop in updates) {
					item[prop] = updates[prop];
				}
			}

			return item;

		});

		await this._updateState({ items });

	}

	_componentDidMount() {
		this.fetchData();
	}

	state = {
		addItemModalOpen: false,
		updateStockModalOpen: false,
		items: [],
		itemModalMode: 'add'
	}

	_render() {

		const { items, dataFetched, isOwner, name, addItemModalOpen, updateStockModalOpen, itemModalMode, itemToBeEdited } = this.state;
		const outletID = this.props.match.params.id;

		const fetchData = this.fetchData.bind(this);
		const openItemModal = this.openItemModal.bind(this);
		const closeItemModal = this.closeItemModal.bind(this);
		const openUpdateStockModal = this.openUpdateStockModal.bind(this);
		const closeUpdateStockModal = this.closeUpdateStockModal.bind(this);
		const addItem = this.addItem.bind(this);
		const deleteItem = this.deleteItem.bind(this);
		const editItem = this.editItem.bind(this);
		const updateStock = this.updateStock.bind(this);
		const updateItem = this.updateItem.bind(this);

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

					<ItemModal open={addItemModalOpen} close={closeItemModal} outletID={outletID} addItem={addItem} updateItem={updateItem} mode={itemModalMode} item={itemToBeEdited} />
					<StockUpdateModal open={updateStockModalOpen} close={closeUpdateStockModal} items={items} outletID={outletID} updateStock={updateStock}  />

					<Button color="primary" onClick={openItemModal}>
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

class ItemModal extends Component {


	state = {
		values: {}
	}

	async submit() {

		const { picture, name, price } = this.state.values;
		const { outletID } = this.props;

		if (!name)
			return alert('Name is required');

		if (!price)
			return alert('Price is required');


		if (!picture)
			return alert('Picture is required');

		if (this.props.mode === 'edit') {

			const payload = {};
			const item = this.props.item;

			if (item.picture !== picture)
				payload.picture = picture;


			if (item.price.toString() !== price.toString())
				payload.price = price;


			if (item.name !== name)
				payload.name = name;

			if (Object.keys(payload).length === 0)
				return alert('No changes made');

			const url = `/api/outlets/${outletID}/items/${item.id}`;

			try {
				await request.patch(url, payload);
				await this.props.updateItem(item.id, payload);
				await this.close();

			} catch (err) {
				alert(getRequestErrorMessage(err))
			}

		} else {
 
			const payload = { name, price, picture };
			const url = `/api/outlets/${outletID}/items`;

			try {

				const response = await request.post(url, payload);
				const { id } = response.data;

				this.props.addItem({ ...payload, id, number_in_stock: 0 });
				this.close();

			} catch (err) {
				alert(getRequestErrorMessage(err));
			}

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

	static  pictureDataToPng(data) {

		const canvas = document.createElement('canvas');
		const img = document.createElement('img');
		const ctx = canvas.getContext('2d');

		return new Promise(resolve => {

			img.onload = function() {
				const { naturalHeight, naturalWidth } = img;
				canvas.width = naturalWidth;
				canvas.height = naturalHeight;
				ctx.drawImage(img, 0, 0, naturalWidth, naturalHeight, 0, 0, naturalWidth, naturalHeight);
				resolve(canvas.toDataURL())				
			}

			img.src = data;
		})


	}


	async onPictureChange(event) {
		
		const file = event.target.files[0];

		if (!file)
			return;

		let picture = await ItemModal.getDataURL(file);
		picture = await ItemModal.pictureDataToPng(picture);
		const values = { ...this.state.values, picture }
		await this._updateState({ values });
	}


	async componentDidUpdate(prevProps, prevState) {

		if (this.props.open === true && prevProps.open === false) {

			if (this.props.mode === 'edit') {
				const { picture, price, name } = this.props.item;
				let { values } = this.state;
				values = { ...values, picture, name, price };

				await this._updateState({ values})
			}

		}
	}


	async close() {

		// clear
		await this._updateState({
			values: {
				picture: '',
				price: '',
				name: ''
			}
		});

		await this.props.close();

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
					<img src={picture} style={{ width: '100%', height: '100%' }} id="img-product" />
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
				<Button variant="contained" color="primary" onClick={submit}>SAVE</Button>
				<Button color="primary" onClick={this.close.bind(this)}>CLOSE</Button>
			</DialogActions>

		</Dialog>
	}
}