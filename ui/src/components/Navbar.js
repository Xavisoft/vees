

import React from 'react';
import Component from '../components/Component';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';

import actions from '../actions';
import request, { getRequestErrorMessage } from '../request';


// styles
const align = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '100%',
	width: '100%'
};

const useStyles = theme => ({
	drawer: {
		'& a': {
			textTransform: 'uppercase',
			color: 'blue',
			fontFamily: 'Arial',
			fontWeight: '600',
			textDecoration: 'none',
			fontSize: 20
		}
	}
})


// function
function setNavbarHeightCSSVar() {

	const navbar = document.getElementById('navbar');

	if (!navbar) 
		return;

	const navbarHeight = navbar.offsetHeight + 'px';
	document.documentElement.style.setProperty('--navbar-height', navbarHeight);
	
}

async function logout() {

	try {
		await request.delete('/api/login-credentials');
		window.Vees.redirect('/');
	} catch (err) {
		alert(getRequestErrorMessage(err));
	}
}


class Navbar extends Component {


	openDrawer() {
		this._updateState({ drawerOpened: true })
	}

	closeDrawer() {
		this._updateState({ drawerOpened: false });
	}


	componentDidMount() {
		// listen to resize
		this.resizeObserver = new ResizeObserver(setNavbarHeightCSSVar);
		setNavbarHeightCSSVar();

	}

	componentWillUnmount() {
		this.resizeObserver.disconnect();;
	}

	state = {
		drawerOpened: false
	}

	render() {

		const links = [
			{
				caption: 'Login',
				route: '/'
			},
			{
				caption: 'Register Outlet',
				route: '/outlets/register'
			},
			{
				caption: 'Create Account',
				route: '/signup',
			},
			{
				caption: 'Outlets',
				route: '/outlets',
			},
			{
				caption: 'cart',
				onClick: actions.openCart
			},
			{
				caption: 'logout',
				onClick: logout
			}
		]

		const { drawerOpened } = this.state;

		const openDrawer = this.openDrawer.bind(this);
		const closeDrawer = this.closeDrawer.bind(this);

		const { classes } = this.props;

		return <AppBar id="navbar">
			
			<Grid container>
				<Grid item xs={9}>
					<div style={align}>
						<h2 style={{ textAlign: 'center' }}>VEE'S</h2>
					</div>
				</Grid>
				<Grid item xs={3}>

					<div style={align}>
						<Button
							variant="text"
							fullWidth
							style={{
								background: 'transparent',
								color: 'white' 
							}}
							onClick={openDrawer}
						>
							<MenuIcon />
						</Button>
					</div>

				</Grid>
			</Grid>


			<Drawer variant="persistant" open={drawerOpened} onClick={closeDrawer} className={classes.drawer}>
				<List>
					<ListItem style={{ borderBottom: '1px solid grey'}}>
						<h2>VEES</h2>
					</ListItem>
					
					{
						links.map(link => {

							const { caption, route, onClick } = link;

							return <ListItem>
								<Link to={route} onClick={onClick}>{caption}</Link>
							</ListItem>
						})
					}
				</List>
			</Drawer>

		</AppBar>
	}
}


export default withStyles(useStyles)(Navbar);