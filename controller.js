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
		res.sendFile(__dirname + '/routes/index.html');
	})

	app.get('/new/*', function(req, res) {
		let url = req.url.slice(5);
		let result;

		if (url.match(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/)) {

			let countDoc = UrlModel.findOne({original_url: "counter"}, function(err, data) {
				if (err) throw err;
				let count = data.short_url;

				let newUrl = { original_url: url, short_url: req.originalUrl + count};
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
			newUrl = { Error: "Wrong URL format. Make sure you include the http://, https:// or ftp:// prefix." };
			res.json(newUrl);
		}
	})

	app.get(/\/[0-9]/, function(req, res) {

		let urlDoc = UrlModel.findOne({short_url: req.url.slice(1)}, function(err, data) {
			if (err) throw err;
			if (data && data.original_url !== "counter") {
				let url = data.original_url;
				res.redirect(url);
			} else {
				res.end("Short Url not found");
			}
		})
	})

	app.use(function(req, res, next) {
	    res.status(400);
	    res.end('404: File Not Found');
	});
}


