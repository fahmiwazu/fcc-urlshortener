require('dotenv').config();
const express = require('express');
const cors = require('cors');
const req = require('express/lib/request');
const app = express();



// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// declare url link and id
const oriurl = []
const shortUrl = []

// post new url service
app.post('/api/shorturl', (req, res) => {

  // insert url
  const url = req.body.url;

  // url validation 
  if (!url.includes("https://") && !url.includes("http://")) {
    return res.json({ error: 'invalid url' });
  }

  // url id declaration
  const urlID = oriurl.indexOf(url);

  // store url into array and skip if url already existed
  if (urlID < 0) {
    oriurl.push(url);
    shortUrl.push(shortUrl.length);

    return res.json({
      original_url: url,
      short_url: shortUrl.length - 1
    });
  }

  // return existing url
  return res.json({
    original_url : url,
    short_url : shortUrl[urlID]
  });


});

// redirect url service
app.get('/api/shorturl/:shorturl', (req, res) => {
  // declare shorturl id and parse into integer
  const shorturl = parseInt(req.params.shorturl);
  const urlID = shortUrl.indexOf(shorturl);

  // validate url if not existed
  if (urlID < 0) {
    return req.json({
      error: "No short URL found for the given input"
    });
  }

  // redirect into url destination
  res.redirect(oriurl[urlID]);

});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
