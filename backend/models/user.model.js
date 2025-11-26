import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:[6, 'Email must be at least 6 characters long'],
        maxLength:[50, 'Email must not be longer than 50 characters']

    },
    password:{
        type:String,
        select: true
    },

},{ timestamps:true})

//hashing password before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isValidPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = function(){
    return jwt.sign(
        { _id:this._id,email: this.email }, 
        process.env.JWT_SECRET,
        { expiresIn: '24h'}
    );

}

const User = mongoose.model('User', userSchema);

export default User;