const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");

const request = require("supertest");
const mongoose = require("mongoose");

describe("api/returns", () => {
  let server;
  let rental;
  let customerId;
  let movieId;

  let token;

  const exec = async () => {
    return await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index");
    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

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
    await server.close();
    await Rental.deleteMany({});
  });

  it("should return 401 if client is not logged in", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    customerId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if movieId is not provided", async () => {
    movieId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental found for the given movie/customer", async () => {
    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it("should return 400 if return is already processed", async () => {
    rental.dateReturned = Date.now();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if return we have a valid request", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should set the return date if request is valid.", async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    const diff = new Date() - rentalInDb.dateReturned;
    expect(diff).toBeLessThan(10 * 1000); // Max diff: 10 seconds (if test is slow...)
  });
});
