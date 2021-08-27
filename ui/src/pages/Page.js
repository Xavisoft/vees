
import React from 'react';
import Component from '../components/Component';


class Page extends Component {

	constructor(props) {
		
		super(props);

		if (window.Netro === undefined) {

			// setting up the Netro global object
			window.Vees = {};
			window.Vees.history = props.history;
			
			// creating a function to redirect SPAically 
			const redirect = (path) => {
				window.Vees.history.push(path);
			}

			window.Vees.redirect = redirect;
			Page.redirect = redirect;
					
		}

	}

	_componentDidMount() {

	}

	async componentDidMount() {
		await this._componentDidMount();
		window.scrollTo(0, 0);
	}

	_render() {
		return <h1>Please implement <code>_render()</code></h1>
	}

	render() {
		return <div className="page">
			{this._render()}
		</div>
	}

}

export default Page;