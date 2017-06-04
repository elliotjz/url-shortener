
const express = require('express');
const controller = require('./controller');

let app = express();

controller(app);

app.listen(process.env.PORT || 3000, function () {
  console.log('url-shortener listening on port 3000!');
})