import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";
import User from "../models/user.model.js";

export const authUser = async (req,res,next)=>{
    try{
      
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            return res.status(401).send({error:'Unauthorized User'});
        }
        //check if token is blacklisted
        const isBlackListed = await redisClient.get(token);
        if(isBlackListed){
            res.cookie('token','');
            return res.status(401).send({error: "Unauthorized User"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?._id).select("-password");
        if(!user){
            throw new error("User not found");
        }
        req.user = user;
        next();
    }catch (error) {
        // console.log(error);
        res.status(401).send({ error: 'Invalid token' });
    }
}