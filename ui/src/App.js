import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

// style-sheets
import './App.css';

// components
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import StockUpdateModal from './components/StockUpdateModal';
import Cart from './components/Cart';
import Footer from './components/Footer';


// pages
import Home from './pages/Home';
import Signup from './pages/Signup';
import RegisterOutlet from './pages/RegisterOutlet';
import Outlets from './pages/Outlets';
import Outlet from './pages/Outlet';
import Order from './pages/Order';
import MyOrders from './pages/MyOrders';
import OutletOrders from './pages/OutletOrders';

// state management
import { Provider } from 'react-redux';
import store from './store';


// function
function setWinHeightCSSVar() {

	const winHeight = window.innerHeight + 'px';
	document.documentElement.style.setProperty('--window-height', winHeight);
	
}

window.addEventListener('resize', setWinHeightCSSVar);
setWinHeightCSSVar();



function App() {

	return (

		<Provider store={store}>
			<Router>
				
				<Navbar />
				<Loading />
				<StockUpdateModal />
				<Cart />
				<Footer />

				<Switch>

					<Route exact path="/" component={Home} />
					<Route exact path="/signup" component={Signup} />
					<Route exact path="/outlets/register" component={RegisterOutlet} />
					<Route exact path="/outlets" component={Outlets} />
					<Route exact path="/outlets/:id" component={Outlet} />
					<Route exact path="/outlets/:id/orders" component={OutletOrders} />
					<Route exact path="/orders/:id" component={Order} />
					<Route exact path="/my-orders" component={MyOrders} />


				</Switch>

				
			</Router>
		</Provider>
	);
}


export default App;