const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require('../models/connectionRequest');
const { connect } = require('mongoose');
const User = require("../models/user");
const connectionRequestModel = require('../models/connectionRequest');
const axios = require("axios");

// POST API MEANS USER CAN ENTER SOME DATA IN THE DATABASE MEANS I WILL VERIFY EACH AND EVERYTHING IN 
//THE DATABASE BECAUSE HACKER CAN DO ANYTHING IN THE POST API
// GET API MEANS USER CAN FETCHING SOME INFORMATION ON THE DATABASE MEANS GET API WE WILL ENSURE THAT 
//WE WILL SENDING THE DATA WHICH IS CORRECT FOR USER

//SO BECAUSE THE DATA IS VERY IMPORTANT AS DATA IS THE OIL AND DATA LEAK IS VERY DANGEROUS 
//THAT'S WHY WE ALWAYS ENSURE WHAT IS SENDING BACK TO USER IN GET APIs
//THAT'S WHY ALSO WE ENSURE WHAT IS WRITING USING POST APIs

//send connection Request
// requestRouter.post("/sendConnectionRequest",userAuth,async (req,res) => {
//     const user = req.user;
//     //Sending a connection Request
//     console.log("Sending a connection Request!!");

//     // res.send("Connection Request Sent !!!");
//     res.send(user.firstName + " sent the connection request!!");
// })
requestRouter.post("/request/send/:status/:toUserId",userAuth, async (req,res) =>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested","ignored"];
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message : "Invalid status type : " + status});
        }

        //if user is not available then why send the request
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({ message : "user not found" });
        }
        
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId},
            ],
        });
        if(existingConnectionRequest){
            return res
                .status(400)
                .send({message : "Connection Request Already Exists!!!"});
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        res.json({
            // message : "Connection Request sent succesfully!",
            message: req.user.firstName +" is " + status + " in " + toUser.firstName,
            data,
        });
         
    }catch(err){
        res.status(400).json({ success: false, message: err.message });
    }
    // res.send(user.firstName + " sent the connection request!!!");

})

requestRouter.post("/request/review/:status/:requestId" , userAuth ,async (req,res) =>{
    //ms dhoni => Elon 
    //is elon loggedIn => toUserId
    //status = interested
    //requestId should be valid 
    try{
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        //validate the status 
        const allowedStatus = ["accepted","rejected"];

        if(!allowedStatus.includes(status)){
           return res.status(400).json({message : "Status not allowed!!!" });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : "interested",
        });

    if(!connectionRequest){
        return res
            .status(404)
            .json({message : "connection request not found"});
    }

    connectionRequest.status = status;
        
    const data = await connectionRequest.save();

    res.json({message : "Connection Request " + status, data});
    }catch(err){
        res.status(400).json({ success: false, message: err.message });
    }
})

requestRouter.get("/sikkim-travel-guide", async (req, res) => {
  try {
    const wikiUrl =
      "https://en.wikipedia.org/w/api.php?action=query&titles=List_of_Buddhist_monasteries_in_Sikkim&prop=links&pllimit=max&format=json";

    const wikiRes = await axios.get(wikiUrl, {
      headers: { "User-Agent": "SikkimTourismApp/1.0 (tanush@example.com)" }
    });

    const pages = wikiRes.data.query.pages;
    const pageId = Object.keys(pages)[0];
    const links = pages[pageId].links || [];
    
    const monasteryTitles = links
      .map(link => link.title)
      .filter(title => title.toLowerCase().includes("monastery"));

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const monasteriesWithGuide = await Promise.all(
      monasteryTitles.map(async (title) => {
        try {
          // 1️⃣ Geocode monastery
          const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            title + " Sikkim"
          )}&key=${apiKey}`;

          const geoRes = await axios.get(geoUrl);

          if (!geoRes.data.results?.length) {
            return {
              name: title,
              wiki: `https://en.wikipedia.org/wiki/${encodeURIComponent(
                title.replace(/ /g, "_")
              )}`,
              hotels: [],
              best_hotel: null
            };
          }

          const location = geoRes.data.results[0].geometry.location;

          // 2️⃣ Nearby hotels
          const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=5000&type=lodging&key=${apiKey}`;

          const placesRes = await axios.get(placesUrl);
          const hotelsRaw = placesRes.data.results || [];

          // 3️⃣ Get distance for each hotel
          const hotelsWithDistance = await Promise.all(
            hotelsRaw.slice(0, 10).map(async (h) => {
              try {
                const distUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${location.lat},${location.lng}&destinations=${h.geometry.location.lat},${h.geometry.location.lng}&key=${apiKey}`;

                const distRes = await axios.get(distUrl);

                const element =
                  distRes.data.rows?.[0]?.elements?.[0];

                return {
                  name: h.name,
                  rating: h.rating || 0,
                  reviews: h.user_ratings_total || 0,
                  address: h.vicinity,
                  distance: element?.distance?.text || "N/A",
                  distance_value: element?.distance?.value || Infinity,
                  map: `https://www.google.com/maps/search/?api=1&query=${h.geometry.location.lat},${h.geometry.location.lng}`
                };
              } catch {
                return null;
              }
            })
          );

          // remove nulls
          const validHotels = hotelsWithDistance.filter(Boolean);

          // 4️⃣ Sort nearest → farthest
          validHotels.sort((a, b) => a.distance_value - b.distance_value);

          // 5️⃣ Best hotel = nearest + highest rating
          const bestHotel =
            [...validHotels]
              .sort((a, b) => b.rating - a.rating)[0] || null;

          return {
            name: title,
            wiki: `https://en.wikipedia.org/wiki/${encodeURIComponent(
              title.replace(/ /g, "_")
            )}`,
            best_hotel: bestHotel,
            hotels: validHotels
          };

        } catch {
          return {
            name: title,
            wiki: `https://en.wikipedia.org/wiki/${encodeURIComponent(
              title.replace(/ /g, "_")
            )}`,
            hotels: [],
            best_hotel: null
          };
        }
      })
    );

    res.json({
      total: monasteriesWithGuide.length,
      monasteries: monasteriesWithGuide
    });

  } catch (err) {
    console.error("Sikkim Travel Guide Error:", err.message);
    res.status(500).json({ message: "Failed to load Sikkim travel guide" });
  }
});

module.exports = requestRouter;