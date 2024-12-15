const express = require("express");
const connectDb = require("./database");
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config();

connectDb();


const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors({
  origin: '*',
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   credentials: true,
   optionsSuccessStatus: 204,
 }))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/repair', require('./routes/detailRoutes'))
app.use('/schedule', require('./routes/repairRoutes'))
app.use('/api', require('./routes/paymentRoutes'))


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});