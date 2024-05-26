const request = require("supertest");
const { Rental } = require("../../models/rental");
const mongoose = require("mongoose");

describe("api/returns", () => {
  let server;
  let rental;
  let customerId;
  let movieId;

  beforeEach(async () => {
    server = require("../../index");
    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });

    await rental.save();
  });

  afterEach(async () => {
    server.close();
    await Rental.deleteMany({});
  });

  it("should work", async () => {
    let x = await Rental.findById(rental._id);
    console.log(x);
  });
});
