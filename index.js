const express = require("express")
const http = require("https")
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express()
const server = http.createServer(app)
require('dotenv').config()
app.use(bodyParser.json())
app.use(cors())

const io = require("socket.io")(server)

io.on("connection", (socket) => {
	socket.emit("me", socket.id)

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})

server.listen(process.env.PORT || 5000, () => console.log("server is running on port 5000"))