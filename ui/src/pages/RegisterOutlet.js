
import React from 'react';
import Page from './Page';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';

import request, { getRequestErrorMessage } from '../request';


const useStyles = theme => ({
	root: {
		'& .text-field': {
			marginBottom: '30px'
		}
	}
})


class RegisterOutlet extends Page {

	async submit() {

		const { name, location } = this.state.values;

		if (!name)
			return alert('Name is required');

		if (!location)
			return alert('Location is required');

		const data = { name, location };

		try {
			const response = await request.post('/api/outlets', data);
			alert('Outlet created');
		} catch (err) {
			alert(getRequestErrorMessage(err));
		}

	}

	state = { values: {} }


	_render() {

		const onChangeHandlerGenerator = this.onChangeHandlerGenerator.bind(this);
		const submit = this.submit.bind(this);

		const { name, location } = this.state.values;
		const { classes } = this.props;

		return <div style={{ margin: '100px 20px' }} className={classes.root}>
			<h1 className="center-align">Register Outlet</h1>

			<TextField
				placeholder="Outlet name"
				onChange={onChangeHandlerGenerator('name')}
				value={name}
				className="text-field"
				fullWidth
			/>

			<TextField
				placeholder="Location"
				onChange={onChangeHandlerGenerator('location')}
				value={location}
				className="text-field"
				fullWidth
			/>

			<Button fullWidth variant="contained" color="primary" onClick={submit}>
				REGISTER
			</Button>
		</div>
	}
}

export default withStyles(useStyles)(RegisterOutlet);