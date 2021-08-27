
import { hideLoading, showLoading } from './components/Loading';
const axios = require('axios');
const auth  = require('auth/frontend');

// functions
function showLoadingIfResponseIsForeground(config) {
	
	if (config.background)
		return config;

	showLoading();
	return config;

}

function hideLoadingWhenResponseIsReceived(response) {
	hideLoading();
	return response;
}

function hideLoadingWhenErrorIsReceived(error) {
	hideLoading();
	throw error;
}

function getRequestErrorMessage(error={}) {
	console.log(error);
	const { response={} } = error;
	const { data='' } = response;
	return data.toString() || response.statusText || 'Something went wrong!!'
}

function getRequestErrorStatus(error) {
	const { response={} } = error;
	return response.status || -1;
}

axios.interceptors.request.use(showLoadingIfResponseIsForeground);
axios.interceptors.response.use(hideLoadingWhenResponseIsReceived, hideLoadingWhenErrorIsReceived);

auth({ axios });

export default axios;

export {
	getRequestErrorMessage,
	getRequestErrorStatus
}