
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

let app = express();

// Connect to database
mongoose.connect(process.env.MLAB_URL);

// Create a schema
let urlSchema = new mongoose.Schema({
	original_url: String,
	short_url: String
});

// Create model
let UrlModel = mongoose.model('Todo', urlSchema);

let urlencodedParser = bodyParser.urlencoded({extended: false});



app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
})



app.get('/new/*', function(req, res) {
	let url = req.url.slice(1);
	let result;

	if (url.match(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/)) {
		// Don't know what to do here yet.
		let newUrl = UrlModel(req.body).save
		result = { original_url: url, short_url: "not made yet" };
		res.json(result);

	} else {
		result = { error: "Wrong URL format. Make sure you include the http://, https:// or ftp:// prefix." };
	}
	res.json(result);
})

app.listen(process.env.PORT || 3000, function () {
  console.log('url-shortener listening on port 3000!');
})