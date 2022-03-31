import * as http from "http";

import { Server } from "socket.io";

export const wrapWebsocket = (server: http.Server) => {
    const io = new Server(server, { path: 'ws' });

    io.on("connection", (socket) => {
        //connection is up, let's add a simple simple event
        socket.on("message", (message: string) => {
            //log the received message and send it back to the client
            console.log("[received] %s", message);
            const answer = `Hello, you sent: ${message}`;
            socket.send(answer);
            console.log("[sent] %s", answer);
        });

        //send immediatly a feedback to the incoming connection
        console.log("[opened] Connection opened");
        socket.send("Hi there, I am a WebSocket server");

        let i = 0;
        let timeoutId: NodeJS.Timeout | undefined;

        function schedule() {
            timeoutId = setTimeout(() => {
                socket.send(i);
                console.log("[sent] %s", i++);
                schedule();
            }, Math.floor(Math.random() * 5000) + 5000);
        }
        schedule();

        socket.on("disconnect", () => {
            console.log("[closed]");
            clearTimeout(timeoutId!);
        });
    });
};
