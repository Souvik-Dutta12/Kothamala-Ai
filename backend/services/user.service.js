import User from "../models/user.model.js";


export const createUser = async({email,password}) =>{
    
    const existingUser = await User.findOne({email});
    if(existingUser){
        throw new Error('User with this email already exists');
    }

    const user = await User.create({
        email,
        password    
    });

    return user;
}

export const getAllUsers = async () => {
   return await User.find().select('-password');
}