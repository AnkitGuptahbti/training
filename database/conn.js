import mongoose from "mongoose";
export const connectDB = (url) => {
  mongoose
    .connect(url, { dbName: "Daffo" })
    .then((data) => {
      console.log(`connect to DB : ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
};