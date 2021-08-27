

import { createStore } from 'redux';
import reducer from './reducer';


const initialState = {
	cart: [],
	cartMap: new Map(),
	cartOpen: false
}

export default createStore(reducer, initialState);