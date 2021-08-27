
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


class Signup extends Page {

	state = { values: {} }

	async submit() {

		const { name, email, password, confirm_password, location } = this.state.values;

		if (!name)
			return alert('Provide name');

		if (!email)
			return alert('Provide email');

		if (!password)
			return alert('Provide password');

		if (!confirm_password)
			return alert('Confirm password');

		if (password !== confirm_password)
			return alert('Password mismatch');

		if (!location)
			return alert('Provide location');

		const data = { name, email, password, location };

		try {
			await request.post('/api/users', data);
			alert('Account created successfully, you will be redirected to sign in.');
			window.Vees.redirect('/');
		} catch (err) {
			alert(getRequestErrorMessage(err))
		}
	}

	_render() {

		const { name, email, password, confirm_password, location } = this.state.values;

		const onChangeHandlerGenerator = this.onChangeHandlerGenerator.bind(this);
		const submit = this.submit.bind(this);

		return <div className={this.props.classes.root}>

			<h1 style={{ padding: '40px 0'}}>
				CREATE ACCOUNT
			</h1>

			<TextField
				fullWidth
				size="large"
				id="txt-name"
				placeholder="Name"
				value={name}
				onChange={onChangeHandlerGenerator('name')}
				className="text-field"
			/>

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
				type="password"
				placeholder="Password"
				value={password}
				onChange={onChangeHandlerGenerator('password')}
				className="text-field"
			/>

			<TextField
				fullWidth
				size="large"
				id="txt-confirm"
				type="password"
				placeholder="Confirm password"
				value={confirm_password}
				onChange={onChangeHandlerGenerator('confirm_password')}
				className="text-field"
			/>

			<TextField
				fullWidth
				size="large"
				id="txt-location"
				placeholder="Location"
				value={location}
				onChange={onChangeHandlerGenerator('location')}
				className="text-field"
			/>



			<Button
				fullWidth
				variant="contained"
				size="large"
				color="primary"
				onClick={submit}
			>
				CREATE ACCOUNT
			</Button>

			<span className="center-align">
				Already have an account? <Link to="/">Sign in</Link>
			</span>

		</div>
	}
}


const StyledSignup = withStyles(useStyles)(Signup);
export default StyledSignup;