'use strict';

const { MongoClient } = require("mongodb");
const { numOfRows, seatsPerRow } = require('./constants')
console.log(numOfRows, seatsPerRow)
require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const getSeats = async (req, res) => {
    try {
        const client = await MongoClient(MONGO_URI, options);
        await client.connect()
        const db = client.db("exercise_2")
        const _id = req.body._id
        db
        .collection("seats")
        .find()
        .toArray((err, result) => {
            // console.log(result)
            if (result.length) {
                // const data = result;
                const data = {}
                result.forEach((seat) => {
                    data[seat._id] = seat
                })
                res.status(200).json({ status: 200, data, numOfRows, seatsPerRow })
            } else {
                res.status(404).json({ status: 404, data: "Not Found" });
            }
            client.close()
        })
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message })
    }
};

const bookSeat = async (req, res) => {
    try {
        const client = await MongoClient(MONGO_URI, options);
        await client.connect()
        const db = client.db("exercise_2")
        const _id = req.body.seatId
        const { fullName, email } = req.body
        
        const query = { _id };
        const findSeat = await db.collection("seats").findOne(query)
        console.log(findSeat)
        if (findSeat.isBooked) {
            return res.status(400).json({ status: 400, message: "This seat has already been booked!" })
        }
        const newValues = { $set: { isBooked: true, fullName, email } };
        const r = await db.collection("seats").updateOne(query, newValues);
        assert.strictEqual(1, r.matchedCount);
        assert.strictEqual(1, r.modifiedCount);
        res.status(200).json({ status: 200, _id })
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message })
    }
}


module.exports = { getSeats, bookSeat };
