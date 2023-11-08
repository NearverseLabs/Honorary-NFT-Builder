import mongoose from "mongoose";

const CountSchema = new mongoose.Schema(
  {
    name: String,
    count: Number,
  },
  {
    collection: "aigenerated",
  }
);

const CountModel = mongoose.model("CountModel", CountSchema);

export default CountModel;
