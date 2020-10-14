"use strict";

const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const seats = [];
const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
for (let r = 0; r < row.length; r++) {
  for (let s = 1; s < 13; s++) {
    seats.push({ price: 225, isBooked: false, _id: `${row[r]}-${s}` });
  }
}

const putSeats = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_2");

    const r = await db.collection("seats").insertMany(seats);
    assert.strictEqual(seats.length, r.insertedCount)
    res.status(201).json({ status: 201, data: seats });

    // close the connection to the database server
    client.close();
  } catch (err) {
      res.status(500).json({ status: 500, message: err.message })
  }
};

// Adds the seats into the database
// putSeats()

module.exports = { putSeats }
