import app from "./app.js";
import connectDB from "./config/DB.js";
import http from "http";
import initSocket from "./config/socket.js";
const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => {

    const httpServer = http.createServer(app);
    const io = initSocket(httpServer);
    app.set("io", io);
    httpServer.listen(PORT, () => {
      console.log("server is running on port " + PORT);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database", error);
  });
