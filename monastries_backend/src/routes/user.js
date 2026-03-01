const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user");

const USER_SAFE_DATA = "firstName lastName age gender photourl about skills";

//Get all the pending connection request for loggedIn user
userRouter.get("/user/requests/received", userAuth , async (req , res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested",
         }).populate("fromUserId","firstName lastName photoUrl age gender about skills");
        // populate("fromUserId",["firstName","lastName"]);
        // populate("fromUserId") it gives all the information if we don't apply filter
        res.json({
            message : "Data Fetched Successfully",
            data : connectionRequest,
        })
    }catch(err){
        res.status(400).json({ success: false, message: err.message });
    }
})

userRouter.get("/user/connections",userAuth,async (req,res)=>{
        try{
            const loggedInUser = req.user;
            //Tanush => Elon => accepted
            //Elon => Mahendra singh dhoni => accepted
            const connectionRequest = await ConnectionRequest.find({
                $or:[
                    {toUserId : loggedInUser._id,status : "accepted"},
                    {fromUserId : loggedInUser._id,status : "accepted"}
                ]
            })
                .populate("fromUserId",USER_SAFE_DATA)
                .populate("toUserId",USER_SAFE_DATA);

            const data = connectionRequest.map((row) =>{ 
                if(row.fromUserId._id.toString() === loggedInUser._id.toString())
                    return row.toUserId;
                return row.fromUserId;
            });
             
            res.json({data : connectionRequest});
        }catch(err){
            res.status(400).json({ success: false, message: err.message });
        }
})

// '/feed?page=2&limit=100' 

userRouter.get("/user/feed",userAuth,async (req,res) =>{
    try{
        //Todo : 
        //1.) user should not see it's own card 
        //2.) user should not see the card who already ignored it 
        //3.) user should not see which they already sent the connection request

        //Example - Rahul = [Akshay , Elon , tanush , virat, ms dhoni]
        // Rahul -> Akshay -> rejected , R -> Elon -> Accepted
        // Elong -> everyone else but not rahul 
        // Akshay -> not Rahul Rest all 
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1 ;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = ( page - 1 ) *  limit;

        //Find all the connections request (sent + received)
        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {fromUserId : loggedInUser._id},
                {toUserId : loggedInUser._id}
            ],

        }).select("fromUserId toUserId")
        // .populate("fromUserId","firstName")
        // .populate("toUserId","firstName");

        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });
        // console.log(hideUsersFromFeed);
        const users = await user.find({
           $and: [ 
            {_id : { $nin: Array.from(hideUsersFromFeed) }  },
            { _id: { $ne : loggedInUser._id }  },
        ],
        }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);

        // res.send(connectionRequest);
        // res.json({
        //     message : "Data fetched successfully",
        //     data : users
        // });
        res.json(users);
    }catch(err){
        res.status(400).json({ success: false, message: err.message });
    }
})
module.exports = userRouter;