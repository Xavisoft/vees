


export default function (state, action) {

	const { type, payload } = action;

	let { cart, cartMap } = state;
	
	switch (type) {
		case "ADD_ITEM_TO_CART":
			
			const { item, quantity=1 } = payload;
			const itemID = item.id;

			if (cartMap.get(itemID)) {
				for (let i in cart) {

					const cartItem = cart[i];

					if (cartItem.id === itemID) {
						const new_quantity = cartItem.quantity + quantity;

						if (new_quantity > 0) {
							cartItem.quantity = new_quantity;
						}
					}

				};
			} else {
				const cartItem = {
					quantity,
					id: itemID,
					item
				}

				cart.push(cartItem)
				cartMap.set(itemID, cartItem);
			}

			return { ...state, cartMap, cart: [ ...cart ] };

		case 'OPEN_CART':
			return { ...state, cartOpen: true }

		case 'CLOSE_CART':
			return { ...state, cartOpen: false }

		case 'EMPTY_CART':
			return {
				...state,
				cart: [],
				cartMap: new Map()
			};

		case 'REMOVE_ITEM_FROM_CART':
			const { id } = payload;
			cart = cart.filter(cartItem => {
				return cartItem.id !== id;
			});

			return {
				...state,
				cartMap,
				cart
			}

		
		default:
			return state;
			
	}
	
}