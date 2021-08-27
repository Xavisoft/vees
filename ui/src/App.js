import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// style-sheets
import './App.css';

// components
import Navbar from './components/Navbar';
import Loading, { showLoading, hideLoading } from './components/Loading';
import StockUpdateModal from './components/StockUpdateModal';
import Cart from './components/Cart';
// import RemoteProxy from 'remote-proxy/frontend'

// pages
import Home from './pages/Home';
import Signup from './pages/Signup';
import RegisterOutlet from './pages/RegisterOutlet';
import Outlets from './pages/Outlets';
import Outlet from './pages/Outlet';

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

				<Route exact path="/" component={Home} />
				<Route exact path="/signup" component={Signup} />
				<Route exact path="/outlets/register" component={RegisterOutlet} />
				<Route exact path="/outlets" component={Outlets} />
				<Route exact path="/outlets/:id" component={Outlet} />

				
			</Router>
		</Provider>
	);
}


export default App;



// 
// const remote = new RemoteProxy({ url: 'http://localhost:8080', secret_key: '1' });