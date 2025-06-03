const express = require('express');
const app = express();
const path = require('path');

// Set view engine
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
  res.render('dashboard');
});



app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});