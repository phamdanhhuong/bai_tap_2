const express = require("express");
const configViewEngine = require("./config/viewEngine.js");
const bodyParser = require("body-parser");
const initWebRoutes = require("./routes/web.js");
const connectDB = require("./config/configdb.js");
const connectMongoDB = require("./config/mongodb.js");
require('dotenv').config();

const app = express();
const port = 3000 || process.env.PORT;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Config view engine
configViewEngine(app);

// Initialize web routes
initWebRoutes(app);

// Connect to databases
connectDB(); // Sequelize
connectMongoDB(); // MongoDB

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📊 SQL Routes: http://localhost:${port}/home`);
  console.log(`🍃 MongoDB Routes: http://localhost:${port}/mongo`);
});
