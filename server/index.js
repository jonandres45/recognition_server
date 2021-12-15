const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

//import var local
require('dotenv').config({path: 'variables.env'});

//initialize
const app = express();

//middleware
app.use(bodyParser.json());
app.use(cors());

const recognition = require('./routes/api/recognition');

app.use('/api/recognition', recognition);

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
   console.log(`Server on port ${port}`);
});