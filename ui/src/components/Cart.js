
import React from 'react';
import Component from './Component';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import SubtractIcon from '@material-ui/icons/Remove';
import RemoveIcon from '@material-ui/icons/Clear';


import { connect } from 'react-redux';
import actions from '../actions';

class Cart extends Component {

	getItemByEventTarget(event) {
		const id = event.currentTarget.getAttribute('data-item-id');
		let item;		
		const cart = this.props.cart;

		for (let i in cart) {
			if (cart[i].id.toString() === id) {
				item = cart[i];
				break;
			}
		}

		return item;
	}

	increment(event) {
		const item = this.getItemByEventTarget(event);
		actions.addItemToCart(item, 1);
	}

	decrement(event) {
		const item = this.getItemByEventTarget(event);
		actions.addItemToCart(item, -1);
	}

	remove(event) {
		const id = event.currentTarget.getAttribute('data-item-id');
		actions.removeItemFromCart(parseInt(id));
	} 


	placeOrder() {
		alert('Feature coming soon')
	}

	render() {

		const { cart, open } = this.props;


		let emptyCartJSX;
		if (cart.length === 0) {
			emptyCartJSX = <DialogContentText style={{ padding: '20px' }}>
				Your cart is empty.
			</DialogContentText>
		}


		const increment= this.increment.bind(this);
		const decrement = this.decrement.bind(this);
		const remove = this.remove.bind(this)
		const placeOrder = this.placeOrder.bind(this);

		return <Dialog open={open}>

			<DialogTitle>CART</DialogTitle>

			{
				emptyCartJSX || <DialogContent>

					{
						cart.map(cartItem => {

							const { quantity, item } = cartItem;
							const { name, id } = item;

							return <p style={{ borderBottom: '1px solid grey', fontFamily: 'Arial', padding: '10px 0' }}>
								{quantity} X {name}

								<div style={{ marginTop: '10px' }}>
									<ItemActionButton icon={<SubtractIcon size="small" />} color="blue" onClick={decrement} data-item-id={id} />
									<ItemActionButton icon={<AddIcon size="small" />} color="blue"  onClick={increment} data-item-id={id}   />
									<ItemActionButton icon={<RemoveIcon size="small" />} color="red"  onClick={remove} data-item-id={id}  />
								</div>
							</p>
						})
					}
				</DialogContent>

			}

			<DialogActions>
				<Button onClick={placeOrder}>PLACE ORDER</Button>
				<Button onClick={actions.emptyCart}>EMPTY CART</Button>
				<Button onClick={actions.closeCart}>CLOSE</Button>
			</DialogActions>
		</Dialog>
	}
}


// local components
class ItemActionButton extends Component {

	render() {

		const { icon, onClick, color } = this.props;

		return <Button onClick={onClick} style={{ color }} color="primary" data-item-id={this.props['data-item-id']}>
			{icon}
		</Button>
	}
}


function mapStateToProps(state) {

	const { cart, cartOpen:open, cartMap } = state; 
	return { cart, open, cartMap };
}

export default connect(mapStateToProps)(Cart);