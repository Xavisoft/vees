
import Component from './Component';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';


import { formatPrice } from '../utils';
import actions from '../actions';


class Item extends Component {


	editItem() {
		this.props.edit(this.props.data.id)
	}

	deleteItem() {
		this.props.delete(this.props.data.id);
	}

	addToCart() {
		const item = this.props.data;
		actions.addItemToCart(item, 1);
	}

	render() {

		const { picture, name, price=0, number_in_stock=0 } = this.props.data;
		const { isOwner } = this.props; 


		const deleteItem = this.deleteItem.bind(this);
		const editItem = this.editItem.bind(this);
		const addToCart = this.addToCart.bind(this);

		return <Grid container style = {{ paddingBottom: 0, borderBottom: '1px solid grey' }}>
			<Grid item xs={5}>
				<img src={picture} style={{ width: '100%', aspectRatio: '1' }} />
			</Grid>

			<Grid item xs={7} style={{ padding: 12 }}>
				<h5>{name}</h5>
				<h3>${formatPrice(price)}</h3>
				<span>
					Items In Stock: <span style={{ color: 'green' }}>
					{number_in_stock}
					</span>
				</span>

				{
					isOwner ? (
						<div>
							<Button style={{ color: 'red' }} onClick={deleteItem}>
								delete
							</Button>

							<Button color="primary" onClick={editItem}>
								edit
							</Button>
						</div>
					) : (
						<Button size="small" color="secondary" variant="contained" onClick={addToCart}>
						ADD TO CART
						</Button>
					)
				}
			</Grid>
		</Grid>
	}
}


export default Item