

import store from './store';


function addItemToCart(item, quantity) {
	const payload = { item, quantity };
	const type = 'ADD_ITEM_TO_CART';

	const action = { type, payload };
	store.dispatch(action);
}

function openCart() {
	store.dispatch({ type: 'OPEN_CART'})
}

function closeCart() {
	store.dispatch({ type: 'CLOSE_CART'})
}

function emptyCart() {
	store.dispatch({ type: 'EMPTY_CART'})
}

function removeItemFromCart(id) {
	store.dispatch({ type: 'REMOVE_ITEM_FROM_CART', payload: { id}})
}


const actions = {
	addItemToCart,
	openCart,
	closeCart,
	emptyCart,
	removeItemFromCart
}


export default actions;
