"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bill = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const billSchema = new mongoose_1.default.Schema({
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
});
exports.Bill = mongoose_1.default.model('Bill', billSchema);
