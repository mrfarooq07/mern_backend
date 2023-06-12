const dbConnection = require("mongoose");
const connectDB = async () => {
  try {
    const connect = await dbConnection.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //   useFindAndModify: true,
    });
    console.log(`Mongo DB Connected ${connect.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit();
  }
};

module.exports = connectDB;
