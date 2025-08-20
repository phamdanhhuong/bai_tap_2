import express from "express";
import configViewEngine from "./config/viewEngine.js";
import bodyParser from "body-parser";
import initWebRoutes from "./routes/web.js";
import connectDB from "./config/configdb.js";
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

connectDB();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
