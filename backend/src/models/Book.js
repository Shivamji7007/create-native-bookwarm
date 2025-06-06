import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,   
    },
    captions: {
        type: String,
        required: true,   

    },
    image: {
        type: String,
        required: true,   
    },
    rating: {
        type: String,
        required: true,  
        min: 1,
        max: 5, 
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true,   
    },
},
{timestamps: true}
);

const Book = mongoose.model("Book",bookSchema);

export default bookSchema;