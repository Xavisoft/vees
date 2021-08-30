
import React from 'react';
import Page from './Page';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';

import request, { getRequestErrorMessage } from '../request';


// styles
const useStyles = theme => ({
	root: {
		'& .text-field': {
			marginBottom: '30px'
		},
		margin: '20px',
		'& span.center-align': {
			display: 'block',
			marginTop: '10px',
			color: '#333',
			fontSize: 20
		}
	}
})


class Home extends Page {

	async login() {

		const { email, password } = this.state.values;

		if (!email)
			return alert('Email is required'); 

		if (!password)
			return alert('Password is required');

		const data = { username: email, password };
		try {
			await request.post('/api/login-credentials', data);
			Page.redirect('/outlets');
		} catch (err) {
			alert(getRequestErrorMessage(err));
		}


	}

	state = { values: {} }

	_render() {

		const { email, password } = this.state.values;

		const onChangeHandlerGenerator = this.onChangeHandlerGenerator.bind(this);
		const login = this.login.bind(this);

		return <div className={this.props.classes.root}>

			<h1 className="center-align" style={{ margin: '100px 0', fontSize: 50, fontFamily: 'Arial' }}>
				WELCOME TO<br />
					VEE'S<br />
				CLICK TO EAT
			</h1>

			<TextField
				fullWidth
				size="large"
				id="txt-email"
				placeholder="Email"
				value={email}
				onChange={onChangeHandlerGenerator('email')}
				className="text-field"
			/>

			<TextField
				fullWidth
				size="large"
				id="txt-password"
				placeholder="Password"
				type="password"
				value={password}
				onChange={onChangeHandlerGenerator('password')}
				className="text-field"
			/>

			<Button
				fullWidth
				variant="contained"
				size="large"
				color="primary"
				onClick={login}
			>
				LOGIN
			</Button>

			<span className="center-align">
				Don't have an account? <Link to="/signup">Sign up</Link>
			</span>

		</div>
	}
}

const StyledHome = withStyles(useStyles)(Home);
export default StyledHome;