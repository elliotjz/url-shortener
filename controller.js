let mongoose = require('mongoose');

// Connect to database
mongoose.connect(process.env.MLAB_URL);

// Create a schema
let urlSchema = new mongoose.Schema({
	original_url: String,
	short_url: String
});

// Create model
let UrlModel = mongoose.model('Short-urls', urlSchema);

module.exports = function(app) {

	app.get('/', function(req, res) {
		res.sendFile(__dirname + '/index.html');
	})


	app.get('/new/*', function(req, res) {
		let url = req.url.slice(5);
		console.log(url);
		let result;

		if (url.match(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/)) {
			let countDoc = UrlModel.findOne({original_url: "counter"}, function(err, data) {
				if (err) throw err;
				let count = data.short_url;

				let newUrl = { original_url: url, short_url: count};
				let newUrlDoc = UrlModel(newUrl).save(function(err, data) {
					if (err) throw err;
					res.json(newUrl);
				});

				// Increment counter
				UrlModel.update({original_url: "counter"}, {
					$set: {
						short_url: (parseInt(count) + 1).toString()
					}
				}, function(err, data) {
					if (err) throw err;
				});
			});

		} else {
			newUrl = { error: "Wrong URL format. Make sure you include the http://, https:// or ftp:// prefix." };
			res.json(newUrl);
		}
	})

	app.get('*', function(req, res) {
		let urlDoc = UrlModel.findOne({short_url: req.url.slice(1)}, function(err, data) {
			if (err) throw err;
			let url = data.original_url;
			console.log(url);
		})
	})
}