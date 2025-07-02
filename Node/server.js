const http = require("http");
const app = require("./app");

const normalizePort = (val) => {
  const port = parseInt(val, 10);
  return isNaN(port) ? val : port >= 0 ? port : false;
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const errorHandler = (error) => {
  if (error.syscall !== "listen") throw error;

  const bind = typeof server.address() === "string" ? "pipe " + server.address() : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  console.log("Listening on port " + port);
});

server.listen(port);
