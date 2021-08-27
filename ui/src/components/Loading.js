
import React from 'react';
import Component from './Component';
import Progress from '@material-ui/core/CircularProgress';

let instance;

// styles
const divStyle = {
	justifyContent: 'center',
	alignItems: 'center',
	position: 'fixed',
	left: 0,
	top: 0,
	right: 0,
	bottom: 0,
	background: 'white', //rgba(0, 0, 0, 0.8)',
	zIndex: 2000,
};


// component definition

class LoadingIndicator extends Component {

	state = {
		display: 'none'
	}

	constructor(props) {

		super(props);

		if (instance)
			return instance;

		instance = this;

	}

	hide() {
		this._updateState({ display: 'none' });
	}

	show() {
		this._updateState({ display: 'flex' });
	}

	render() {

		const display = this.state.display;

		return <div style={{ ...divStyle, display }}>
			<Progress variant="indeterminate" id="div-loading-indicator" />
		</div>
	}
}

export default LoadingIndicator;

function hideLoading() {
	try {
		instance.hide();
	} catch(err) {}
}

function showLoading() {
	try {
		instance.show();
	} catch(err) {}
}

export {
	hideLoading,
	showLoading
}