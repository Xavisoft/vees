

import React from 'react';

class Component extends React.Component {

	async _updateState(object) {
		const newState = { ...(this.state || {} ), ...object };
		await this.setState(newState);
	}

	onChangeHandlerGenerator(name) {

		return (function(arg) {

			let value;

			if (typeof arg == 'object')
				value = arg.target.value;
			else
				value = arg;

			const values = (this.componentInstance.state || {} ).values || {};
			values[this.name] = value;

			this.componentInstance._updateState({ values });

		}).bind({ componentInstance: this, name });
	}

	render() {
		return <p>
			Please implement <code>render()</code>
		</p>
	}
}


export default Component;