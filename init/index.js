const mongoose = require("mongoose");
const {Listing}= require("../models/listing");
const sampleData = require("./data");

main().then(res=>console.log(res))
      .catch(err=>console.error(err));
      
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/bookmybrix");
}

const initDB = async () => {
    await Listing.deleteMany({});
    sampleData.data = sampleData.data.map((obj) => ({
        ...obj,
        owner: "6890291c49a8d7e19c996387"
    }))
    await Listing.insertMany(sampleData.data);
    console.log("data was initialized");
}      

initDB();