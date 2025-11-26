import User from '../models/user.model.js';
import redisClient from '../services/redis.service.js';
import { createUser, getAllUsers } from '../services/user.service.js';

export const createUserController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await createUser({email, password});
        if (!user) {
            return res.status(500).json({ message: 'Failed to create user' });
        }

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
export const loginController = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                errors: 'Email and password are required'
            })
        }
        const user = await User.findOne({ email });

        

        if (!user) {
            return res.status(404).json({
                errors: 'User not found'
            })
        }

        const isMatch = await user.isValidPassword(password);
        
        if (!isMatch) {
            return res.status(401).json({
                errors: 'Invalid credentials'
            })
        }

        const token = await user.generateToken();

        const loginUser = await User.findById(user._id).select('-password');
       
        await redisClient.set(`session:${user._id}`, token, 'EX', 7 * 24 * 60 * 60);

        const options = {
            httpOnly: true,
            secure: true,
        }


        res.status(200)
        .cookie("token", token, options)
        .json({
            message: "Login successful",
            token,
            user: loginUser
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
export const profileController = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
  
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
export const logoutController = async (req, res) => {
    try {
        const userId = req.user._id;
        await redisClient.del(`session:${userId}`);
        const options = {
            httpOnly: true,
            secure: true
        }
        res.status(200)
        .clearCookie("token", options)
        .json({
            message: 'Logged out successfully'
        });


    } catch (err) {

        res.status(400).send(err.message);
    }
}
export const getAllUsersController = async (req, res) => {
    try {
        const allUsers = await getAllUsers();

        return res.status(200).json({
            users: allUsers
        })

    } catch (err) {
        res.status(400).json({ error: err.message })

    }
}
