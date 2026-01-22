const userModel = require('../models/user.model');
const foodPartnerModel = require('../models/foodpartner.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//controller for user registration
async function registerUser(req, res) {
  const { fullName, email, password } = req.body;

  const isUserAlreadyExists = await 
  userModel.findOne({ 
    email
  })
  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: 'User already exists'
      
    })
  }

  const hashedpassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullName,
    email,
    password: hashedpassword
  });

  const token = jwt.sign({
    id: user._id,
    email: user.email
  }, process.env.secretkey);
  res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true });

  res.status(201).json(({
    message:  'User registered successfully',
    token,
    user:{
      id: user._id,
      email: user.email,
      fullName: user.fullName
    }
  }))
  
 
}

//controller for user login
async function LoginUser(req, res) {
  const { email, password } = req.body;
  const user = await userModel.findOne({
    email
  })

  if (!user) {
    return res.status(404).json({
      message: 'Invalid email or password'

    })
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if(!isPasswordValid) {
    return res.status(404).json({
      message: 'Invalid email or password'
    })

  }
  const token = jwt.sign({
    id: user._id,
    email: user.email
  }, process.env.secretkey);
  res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true });
  res.status(200).json({
    message: 'User logged in successfully',
  
    user:{
      id: user._id,
      email: user.email,
      fullName: user.fullName
    }
  })

}

//coontroller for user logout
async function LogoutUser(req, res) {
  res.clearCookie('token',{
   httpOnly: true,
    sameSite: 'none',
    secure: true
  });
  res.status(200).json({
   message: 'User Logged out successfully'

  })
}

//controller for foodpartner
async function registerFoodPartner(req, res) {
    const { name, email, password, phone, address, contactName} = req.body;

    const isFoodPartnerAlreadyExists = await foodPartnerModel.findOne({ email });
    if (isFoodPartnerAlreadyExists) {
        return res.status(400).json({
            message: 'Food Partner already exists'
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        contactName
    });

    const token = jwt.sign({
        id: foodPartner._id,
        email: foodPartner.email
    }, process.env.secretkey);
    res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true });
    res.status(201).json({
      message: 'Food Partner registered successfully',
      token,
      foodPartner: {
        id: foodPartner._id,
        email: foodPartner.email,
        name: foodPartner.name,
        contactName: foodPartner.contactName,
        phone: foodPartner.phone,
        address: foodPartner.address
      }
    });
}

async function LoginFoodPartner(req, res) {
    const { email, password } = req.body;
    const foodPartner = await foodPartnerModel.findOne({email});

    if (!foodPartner){
       return res.status(404).json({
        message: 'Invalid email or password'
       })
    }
    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

    if (!isPasswordValid) {
      return res.status(404).json({
        message: 'Invalid email or password'
      })
    }
    const token = jwt.sign({
      id: foodPartner._id,
      email: foodPartner.email
    }, process.env.secretkey);
    res.cookie('token', token, { httpOnly: true, sameSite: 'none' , secure: true});
    res.status(200).json({
      message: 'food partner logged in successfully',
      token,
      foodPartner: {
        id: foodPartner._id,
        email: foodPartner.email,
        name: foodPartner.name
      }
    })

}

async function LogoutFoodPartner(req, res) { 

  res.clearCookie('token',{
    httpOnly: true,
    sameSite: 'none',
    secure: true
  });
}


module.exports = {
  registerUser,
  LoginUser,
  LogoutUser,
  registerFoodPartner,
  LoginFoodPartner,
  LogoutFoodPartner
}