const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

// Signup
exports.signup = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    // Validate required fields
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Respond with user data and token
    res.status(201).json({
      message: 'Signup successful',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.profile = async (req, res) => {
  try {
    // Extract user ID from the JWT
    const userId = req.user?.id; // Ensure `req.user` is populated by JWT middleware

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID is missing in request' });
    }

    // Fetch the user profile by ID
    console.log(userId);
    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the user profile data
    res.status(200).json({
      message: 'User profile fetched successfully',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt, // Include additional fields as needed
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("login",email,"pass",password)  
  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Respond with user data and token
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


//adding budget 

exports.updateBudget=async(req,res)=>{
  const {budget}=req.body;
  const id=req.user.id;
  console.log(`USER ID : ${id}`);
  
  try{
    if(!budget){
      return res.status(400).json({message:'Budget is required'})
    }
    const user=await User.findByIdAndUpdate(id,{budget}, {new:true});
    if(!user){
      return res.status(404).json({message:'User not found'})

    }
    else{
      return res.status(200).json({message:'Budget updated successfully',user})
    }
  }
  catch(error){
    console.log(error)
    res.status(500).json({ message: 'Internal server error', error: error.message });  
  }
  
}


// Fetch the current budget
exports.getBudget = async (req, res) => {
  const id = req.user.id; // User ID from the JWT token

  try {
    const user = await User.findById(id); // Fetch user from the database
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ budget: user.budget }); // Respond with the budget value
  } catch (error) {
    console.error('Error fetching budget:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
