const mongoose = require('mongoose');
const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "user", //reference to the user collection
        required : true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true
    },
    status:{
        type: String,
        required : true,
        //use enum when u restrict user to a certain values
        enum : {
            values : ["ignored","interested","accepted","rejected"],
            message : `{VALUE} is incorrect status type`
        }
    }
},{
    timestamps:true,
});

//connectionRequest.find({fromUserId: 38427983472843998,toUserId: 2398437982748234})

connectionRequestSchema.index({fromUserId : 1 , toUserId : 1});
//what is pre method and when it is called ? 
//This pre is a middleware and it will be called everytime when u save a connection request
//whenever you will call the save method it will be called presave
//save is kind of like a event handler
connectionRequestSchema.pre("save", function (next){
    const connectionRequest = this;
    //Check if the fromUserId is save as the toUserId
    //this if is not mandatory to write and check the if over here 
    //you can just this thing to your API level is also OK
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId))
        throw new Error("Cannot send connection request to yourself !!");
    next(); //always call next over here because it is the middleware and it is mandatory 
    //to pass next over here
})

const connectionRequestModel = new mongoose.model(
    "connectionRequest",
    connectionRequestSchema
)
module.exports = connectionRequestModel;