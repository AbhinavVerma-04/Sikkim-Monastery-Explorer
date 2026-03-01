const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation"); 
const app = express()

app.use(express.json());

// Profile API - for frontend compatibility
profileRouter.get("/profile",userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        age: user.age,
        gender: user.gender,
        photoUrl: user.photoUrl,
        about: user.about,
        skills: user.skills,
        role: user.role,
        contributionPoints: user.contributionPoints,
        contributionsCount: user.contributionsCount,
        badges: user.badges || []
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

//Profile API
profileRouter.get("/profile/view",userAuth, async (req, res) => {
  try {
    //now after attaching middleware we will do some redundant things in this 
    //we will comment this things
    // const { token } = req.cookies; 

    // if (!token) throw new Error("Invalid Credentials");

    // const decodedmessage = jwt.verify(token, "Tanush@123");
    // const { _id } = decodedmessage;
    // console.log("Logged in user is:", _id);

    // const user = await User.findById(_id);
    const user = req.user;
    // if (!user) throw new Error("User does not exist");

    res.json(user);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});


//update data of the user
// profileRouter.patch("/user/:userId", async (req,res) =>{
//     // const userId = req.body.userId;
//     //write ? with params as it is good practice if my code fails then this 
//     //link does not fail
//     const userId = req.params?.userId;
//     const data = req.body;

    
//     try{
//         const ALLOWED_UPDATES = [
//             "firstName",
//             "lastName",
//             "skills",
//             "age"
//         ];
//         // const users = await User.findByIdAndUpdate({_id : userId},data,{
//         //     returnDocument : "before"
//         // });
//         // console.log(users);
//         const isUpdateAllowed = Object.keys(data).every((k) =>
//         ALLOWED_UPDATES.includes(k)
//         );

//     if(!isUpdateAllowed){
//        throw new Error("Update not allowed");
//     }
//     if(data?.skills.length > 30) 
//         throw new Error("Too much load");

//     const users = await User.findByIdAndUpdate({_id : userId},data,{
//             runValidators: true,
//             returnDocument: "after"
//     }
//     );
//         res.send("User Updated successfully");
//     }catch(err){
//         res.status(400).send("Update failed : "+ err.message);
//     }
// });

profileRouter.patch("/profile/edit",userAuth,async (req,res) =>{
    try{    

        if(!validateEditProfileData(req))
            throw new Error("Invalid Edit request");

        const loggedInUser = req.user;
        console.log(loggedInUser);
        //this is very bad way to do this
        // loggedInUser.firstName = req.body.firstName;
        // loggedInUser.lastName = req.body.lastName;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();
        console.log(loggedInUser);
        // res.send(`${loggedInUser.firstName},  your profile was updated successfully`);
        res.json({ message : `${loggedInUser.firstName},  your profile was updated successfully`, data : loggedInUser });
    }catch(err){
        res.status(400).json({ success: false, message: err.message });
    }
})

module.exports = profileRouter;