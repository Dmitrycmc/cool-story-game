import * as WebSocket from "ws";
import * as http from 'http';
import { IncomingMessage } from "http";

const roomIdToSessionsList: Record<
    string,
    {
        ws: WebSocket;
        req: IncomingMessage;
    }[]
> = {};

export const wrapWebsocket = (server: http.Server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
        ws.on('message', (str: string) => {
            const msg = JSON.parse(str);

            switch (msg.type) {
                case 'JOIN':
                    if (!roomIdToSessionsList[msg.roomId]) {
                        roomIdToSessionsList[msg.roomId] = [];
                    }

                    if (!roomIdToSessionsList[msg.roomId].some((r) => r.ws === ws)) {
                        roomIdToSessionsList[msg.roomId].push({ ws, req });
                    }
                    break;
            }
        });

        ws.on('close', () => {
            Object.values(roomIdToSessionsList).forEach((wsList) => {
                const i = wsList.findIndex((r) => r.ws === ws);
                if (i != -1) {
                    wsList.splice(i, 1);
                }
            });
        });
    });
};

export const broadcast = (roomId: string, msg: any): void => {
    const list = roomIdToSessionsList[roomId];
    list.forEach((r) => {
        r.ws.send(JSON.stringify(msg));
    });
};
