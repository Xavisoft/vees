
module.exports = function (err, res) {
	res.status(500).send('The was a technical problem on our end');
	console.log(err);
} 