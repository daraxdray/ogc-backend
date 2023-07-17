const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const passport = require("passport");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const cors = require("cors");
const app = express();
const PORT = process.env.PART || 4000;
var multer = require("multer");
var upload = multer();

//Load Configuration
dotenv.config({ path: "./config/config.env" });

//Passport Configuration
require("./config/passport").p(passport);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Setting the session store
const uri =
  process.env.MONGO_URI ||
  `mongodb://localhost/please-set-process-env-mongodb-uri`;
const store = new mongoDBStore({
  uri: uri,
  collection: "sessions",
});

//initiaing token session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    // configure the cookie to last for 1 day (might edit later)
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// set public folder for uploading and retrieving file (localhost:3000/filename)
app.use(express.static("uploads"));

//cors
var corsOptions = {
  origin: [
    //backoffice frontend adress
    "http://143.244.206.132",
    //test adress
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:8080",
    "http://localhost:8081",
    "http://localhost:8082",
    //Fronend address
    "http://174.138.102.94:80",
    "http://174.138.102.94:8080",
    //Frontend https
    "http://174.138.102.94:443",
    "http://174.138.102.94",
    //Domain Name
    "http://ogcpublications.com",
    "http://www.ogcpublications.com",
    "http://front.herbo-terra.com/",
    //HTTPS Domain Name
    "https://ogcpublications.com",
    "https://dbweb.ogcpublications.com",
    "https://www.ogcpublications.com",
    "https://front.herbo-terra.com/",
    "https://ogc-new-admin.s3.eu-north-1.amazonaws.com",
  ],
  credentials: true,
  methods: "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS",
};
app.use(cors(corsOptions));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//DB Connection
connectDB();

//routes
app.use("/auth", require("./routes/authentication.routes"));
app.use("/users", require("./routes/user.routes"));
app.use("/books", require("./routes/book.routes"));
app.use("/reviews", require("./routes/review.routes"));
app.use("/music", require("./routes/music.routes"));
app.use("/albums", require("./routes/album.routes"));
app.use("/podcasts", require("./routes/podcast.routes"));
app.use("/episodes", require("./routes/episode.routes"));
app.use("/carts", require("./routes/cart.routes"));
app.use("/packs", require("./routes/pack.routes"));
app.use("/newsletter", require("./routes/NewsLetterRoutes"));
app.use("/newsletterjanifer",require("./routes/NewsLetterJanifer.routes"))
app.use("/purchase", require("./routes/purchase.routes"));
app.use("/", require("./config/passport").router);

//Server Launch
app.listen(PORT, console.log(`server running on ${PORT}`));
