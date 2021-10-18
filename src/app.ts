import dotenv from "dotenv";
import express from "express";
import MasterRouter from "./routers/index";
import cors from "cors";

// load the environment variables from the .env file
dotenv.config({
	path: ".env",
});

/**
 * Express server application class.
 * @description Will later contain the routing system.
 */
class Server {
	public app = express();
	public router = MasterRouter;
}

const whitelist = [
	"http://localhost:3000",
	"http://localhost:3001",
	"https://kanongame-jk.herokuapp.com:5000",
];

const corsOptions = {
	origin: (origin, callback) => {
		if (
			process.env.ENV === "local" ||
			whitelist.indexOf(origin) !== -1 ||
			!origin
		) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
	exposedHeaders: ["x-auth-token", "Set-Cookie"],
};

// initialize server app
const server = new Server();
server.app.use(cors(corsOptions));
server.app.use("/api", server.router);

// make server listen on some port
((port = process.env.PORT || 5000) => {
	server.app.listen(port, () => console.log(`> Listening on port ${port}`));
})();
