import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000!');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];
wss.on("connection", (socket) => { //여기서의 socket은 연결된 브라우저를 뜻한다. 1-8 9분 참조
    sockets.push(socket);
    socket["nickname"] = "익명의 프로도";
    console.log("Connected to Browser 😍");
    socket.on("close", () => console.log("Disconnected from the browser ❌"));
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch (message.type) {
            case "new_message":
                sockets.forEach(aSockets => aSockets.send(`${socket.nickname}: ${message.payload}`));
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        }
    });
});

server.listen(3000, handleListen);