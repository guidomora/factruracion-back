import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    paid: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})


export const Bill = mongoose.model('Bill', billSchema);