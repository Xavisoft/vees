

import React from 'react';
import Page from './Page';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import request, { getRequestErrorMessage } from '../request';

class Outlets extends Page {

	async fetchOutlets() {

		try {

			const response = await request.get('/api/outlets');
			const outlets = response.data;

			await this._updateState({ outlets, fetched: true });
		} catch (err) {
			alert(getRequestErrorMessage(err))
		}
	}


	_componentDidMount() {

		this.fetchOutlets();
	}


	state = {
		outlets: [],
		fetched: false
	}


	_render() {

		const { outlets, fetched } = this.state;

		const fetchOutlets = this.fetchOutlets.bind(this);


		let noOutletsJSX, notFetchedJSX;

		const noContentDivStyle = {
			display: 'flex', 
			justifyContent: 'center', 
			alignItems: 'center', 
			height: 'calc(var(--window-height) - var(--navbar-height))'
		}

		if (!fetched) {
			notFetchedJSX = <div style={noContentDivStyle}>

				<h3>Fetching data failed.</h3>
				<Button color="primary" variant="contained" onClick={fetchOutlets}>
					retry
				</Button>
			</div>
		} else {
			if (outlets.length === 0) {
				noOutletsJSX = <div style={noContentDivStyle}>
					<h3>No outlets yet.</h3>
				</div>
			}
		}

		return notFetchedJSX || noOutletsJSX || <div style={{ margin: '20px' }}>

			<h1 className="center-align">Available Outlets</h1>

			{
				outlets.map(outlet => {
					const { id, name, location } = outlet;

					return <div style={{ borderBottom: '1px solid grey', paddingBottom: '20px' }}>
						<h2>{name}</h2>
						<h3 style={{ color: 'grey'}}>{location}</h3>

						<Button variant="contained" color="primary" component={Link} to={`/outlets/${id}`}>
							CHECK US OUT
						</Button>
					</div>
				})
			}
		</div>
	}
}


export default Outlets;