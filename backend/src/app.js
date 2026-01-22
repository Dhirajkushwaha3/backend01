//create the server
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
   origin:[
      'http://localhost:5173',
      // TODO: replace with your actual deployed frontend domain
      'https://backend001-frontend.onrender.com'
   ],
   credentials: true,
   allowedHeaders: ['Content-Type', 'Authorization'],
   exposedHeaders: ['Authorization']
}));


app.get('/', (req,res) => {
   res.send('hello from express server');
})

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

module.exports = app;