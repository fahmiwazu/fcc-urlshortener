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

const oriurl = []
const shortUrl = []

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;

  if (!url.includes("https://") && !url.includes("http://")) {
    return res.json({ error: 'invalid url' });
  }

  const urlID = oriurl.indexOf(url);

  if (urlID < 0) {
    oriurl.push(url);
    shortUrl.push(shortUrl.length);

    return res.json({
      oriurl: url,
      shorturl: shortUrl.length - 1
    });
  }

  return res.json({
    oriurl: url,
    shorturl: shortUrl[urlID]
  });


});


app.get('/api/shorturl/:shorturl', (req, res) => {
  const shorturl = parseInt(req.params.shorturl);
  const urlID = shortUrl.indexOf(shorturl);

  if (urlID < 0) {
    return req.json({
      error: "No short URL found for the given input"
    });
  }

  res.redirect(oriurl[urlID]);

});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
