
import React from 'react';
import Component from './Component';
import BackIcon from '@material-ui/icons/ArrowBack';
import QuitIcon from '@material-ui/icons/PowerSettingsNew';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';



const footerStyle = {
	position: 'fixed',
	color: 'white',
	background: '#f50057',
	left: 0,
	right: 0,
	bottom: 0,
	padding: '10px'
}


function back() {
	window.Vees.history.goBack();
}


class Footer extends Component {


	componentDidMount() {
		const footerHeight = document.getElementById('footer').offsetHeight + 'px';
		document.documentElement.style.setProperty('--footer-height', footerHeight);
	}


	render() {

		return <Grid container id="footer" style={footerStyle}>

			<Grid item xs={6}>
				<Button fullWidth style={{ color: 'white' }} onClick={back}>
					<BackIcon />
				</Button>
			</Grid>

			<Grid item xs={6}>
				<Button fullWidth style={{ color: 'white' }} onClick={window.quitApp}>
					<QuitIcon />
				</Button>
			</Grid>
		</Grid>
	}
}

export default Footer;