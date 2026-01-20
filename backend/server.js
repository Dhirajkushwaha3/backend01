//server start
const app = require('./src/app');
const coonnectDB = require('./src/db/db');
require('dotenv').config();

coonnectDB();




app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})