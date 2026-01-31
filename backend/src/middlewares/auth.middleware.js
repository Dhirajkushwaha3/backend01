const foodPartnerModel = require('../models/foodpartner.model');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');


async function authFoodPartnerMiddleware(req, res, next) {
  // Support cookie-based token (preferred) and Authorization Bearer header as a fallback
  let token = null;
  if (req.cookies && req.cookies.token) token = req.cookies.token;
  if (!token) {
    const auth = req.headers && req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) token = auth.slice(7);
  }
  if (!token) {
    return res.status(401).json({ message: 'Please login First to access this resource' });
  }
  try {
    const decoded = jwt.verify(token, process.env.secretkey);
    const foodPartner = await foodPartnerModel.findById({user: decoded.id});
    if (!foodPartner) {
      return res.status(404).json({message: 'Food partner not found'});
    }
    req.foodPartner = foodPartner;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Token' });
  }



}

async function authUserMiddleware(req, res, next ){
  // Accept cookie token or Authorization header as fallback
  let token = null;
  if (req.cookies && req.cookies.token) token = req.cookies.token;
  if (!token) {
    const auth = req.headers && req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) token = auth.slice(7);
  }
  if (!token) return res.status(401).json({ message: 'Please login First to access this resource' });
  try {
    const decoded = jwt.verify(token, process.env.secretkey);
    const user = await userModel.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Invalid Token' });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
}



module.exports = {
  authFoodPartnerMiddleware,
  authUserMiddleware
};

