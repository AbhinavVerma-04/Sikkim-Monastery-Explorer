const jwt = require("jsonwebtoken");
const User = require("../models/user");


const adminAuth = (req,res,next) =>{
    console.log("Admin auth is getting checked!!!");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized requests");
    }else{
        next();
    }
};

// const userAuth = (req,res,next) =>{
//     console.log("User auth is getting checked!!!");
//     const token = "xyzhh";
//     const isAdminAuthorized = token === "xyz";
//     if(!isAdminAuthorized){
//         res.status(401).send("Unauthorized requests");
//     }else{
//         next();
//     }
// };

const userAuth = async (req,res,next) =>{
    try{
    //Read the token from req cookies
    const { token } = req.cookies;
    if(!token) throw new Error("Token is not valid!!");

    //this is not good to hardcode it in future you will something else
    const decodedObj = await jwt.verify(token,process.env.JWT_SECRET);
    const {_id} = decodedObj;
    const user = await User.findById(_id);
    if(!user) throw new Error("User not found");
    req.user = user;
    next();
    //validate the token
    }catch(err){
        res.status(401).json({ success: false, message: err.message || "Unauthorized" });
    }
    //find the user
}
module.exports = {
    adminAuth,
    userAuth
};