// import { Server } from "http";
// // import app from "./app";
// // import seedSuperAdmin from "./app/DB";
// import config from "./config/index";
// import { PrismaConnection } from "./app/DB/PrismaConnection";
// import app from "./app";
// import { createGroup } from "./app/modules/chat/chat.Service";
// import { WebSocketServer, WebSocket } from "ws";
// import http from "http";
// import { sendMessage, getGroupMessages } from "./app/modules/chat/chat.Service"; // adjust path
// interface ExtendedWebSocket extends WebSocket {
//   userId?: string;
//   groupId?: string;
// }
// const server: Server = http.createServer(app);
// const wss = new WebSocketServer({ server });

// const port = config.port || 5000;

// async function main() {
//   const server: Server = app.listen(port, async () => {
//     console.log("Sever is running on port ", port);
//     const admin = await PrismaConnection()
//     createGroup([admin?.id])
//   });
//   const exitHandler = () => {
//     if (server) {
//       server.close(() => {
//         console.info("Server closed!");
//       });
//     }
//     process.exit(1);
//   };

//   process.on("uncaughtException", (error) => {
//     console.log(error);
//     exitHandler();
//   });

//   process.on("unhandledRejection", (error) => {
//     console.log(error);
//     exitHandler();
//   });
// }



// // // Extend WebSocket type
// // interface ExtendedWebSocket extends WebSocket {
// //   userId?: string;
// //   groupId?: string;
// // }

// // // HTTP server
// // const server = http.createServer();
// // const wss = new WebSocketServer({ server });

// // wss.on("connection", (ws: ExtendedWebSocket) => {
// //   console.log("✅ New client connected");

// //   ws.on("message", async (raw) => {
// //     try {
// //       const data = JSON.parse(raw.toString());

// //       switch (data.type) {
// //         case "joinGroup":
// //           ws.userId = data.userId;
// //           ws.groupId = data.groupId;
// //           console.log(`User ${ws.userId} joined group ${ws.groupId}`);

// //           // Load last 50 messages
// //           const history = await getGroupMessages(data.groupId);
// //           ws.send(JSON.stringify({ type: "history", messages: history }));
// //           break;

// //         case "sendMessage":
// //           if (!ws.groupId || !ws.userId) return;

// //           const message = await sendMessage(
// //             data.senderId,
// //             data.groupId,
// //             data.content
// //           );

// //           // Broadcast to group members
// //           wss.clients.forEach((client: ExtendedWebSocket) => {
// //             if (client.readyState === WebSocket.OPEN && client.groupId === data.groupId) {
// //               client.send(JSON.stringify({ type: "newMessage", message }));
// //             }
// //           });
// //           break;

// //         default:
// //           console.log("Unknown event:", data.type);
// //       }
// //     } catch (err) {
// //       console.error("❌ Error parsing WS message:", err);
// //     }
// //   });

// //   ws.on("close", () => {
// //     console.log(`❌ User ${ws.userId} disconnected`);
// //   });
// // });

// // // server.listen(5000, () => {
// // //   console.log("🚀 WebSocket server running on ws://localhost:5000");
// // // });

// // Attach WebSocket to this server
// // const wss = new WebSocketServer({ server });

// // WebSocket events
// wss.on("connection", (ws: ExtendedWebSocket) => {
//   console.log("✅ New client connected");

//   ws.on("message", async (raw) => {
//     try {
//       const data = JSON.parse(raw.toString());

//       switch (data.type) {
//         case "joinGroup":
//           ws.userId = data.userId;
//           ws.groupId = data.groupId;
//           console.log(`User ${ws.userId} joined group ${ws.groupId}`);

//           const history = await getGroupMessages(data.groupId);
//           ws.send(JSON.stringify({ type: "history", messages: history }));
//           break;

//         case "sendMessage":
//           if (!ws.groupId || !ws.userId) return;

//           const message = await sendMessage(
//             data.senderId,
//             data.groupId,
//             data.content
//           );

//           wss.clients.forEach((client: ExtendedWebSocket) => {
//             if (
//               client.readyState === WebSocket.OPEN &&
//               client.groupId === data.groupId
//             ) {
//               client.send(JSON.stringify({ type: "newMessage", message }));
//             }
//           });
//           break;

//         default:
//           console.log("Unknown event:", data.type);
//       }
//     } catch (err) {
//       console.error("❌ Error parsing WS message:", err);
//     }
//   });

//   ws.on("close", () => {
//     console.log(`❌ User ${ws.userId} disconnected`);
//   });
// });

// main();
import { Server } from "http";
import config from "./config/index";
import { PrismaConnection } from "./app/DB/PrismaConnection";
import app from "./app";
import { createGroup } from "./app/modules/chat/chat.Service";
import { WebSocketServer, WebSocket } from "ws";
import { sendMessage, getGroupMessages } from "./app/modules/chat/chat.Service";

interface ExtendedWebSocket extends WebSocket {
  userId?: string;
  groupChatId?: string;
}

const port = config.port || 5000;

// ✅ Create one shared HTTP server
const server: Server = require("http").createServer(app);

// ✅ Attach WebSocket to this same server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws: ExtendedWebSocket) => {
  console.log("✅ New client connected");

  ws.on("message", async (raw) => {
    try {
      const data = JSON.parse(raw.toString());

      switch (data.type) {
        case "joinGroup":
          ws.userId = data.userId;
          ws.groupChatId = data.groupId;
          console.log(`User ${ws.userId} joined group ${ws.groupChatId}`);

          const history = await getGroupMessages(data.groupId, 50);
          ws.send(JSON.stringify({ type: "history", messages: history }));
          break;
        case "sendMessage":

          try {
            // ✅ Use ws.userId and ws.groupChatId (from joinGroup)
            const message = await sendMessage(
              data.userId,
              data.groupId,
              data.content
            );

            console.log("✅ Message saved:", message);

            // Broadcast to all clients in the same group
            wss.clients.forEach((client: ExtendedWebSocket) => {
              if (
                client.readyState === WebSocket.OPEN &&
                client.groupChatId === data.groupId
              ) {
                client.send(JSON.stringify({ type: "newMessage", message }));
              }
            });
          } catch (err) {
            console.error("❌ Failed to send message:", err);
            ws.send(JSON.stringify({ type: "error", error: "Message send failed" }));
          }
          break;

        default:
          console.log("Unknown event:", data.type);
      }
    } catch (err) {
      console.error("❌ Error parsing WS message:", err);
    }
  });

  ws.on("close", () => {
    console.log(`❌ User ${ws.userId} disconnected`);
  });
});

async function main() {
  server.listen(port, async () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`🚀 WebSocket ready on ws://localhost:${port}`);

    const admin = await PrismaConnection();
    createGroup([admin?.id]);

    // const exitHandler = () => {
    //   if (server) {
    //     server.close(() => {
    //       console.info("Server closed!");
    //     });
    //   }
    //   process.exit(1);
    // };

    // process.on("uncaughtException", (error) => {
    //   console.log(error);
    //   exitHandler();
    // });

    // process.on("unhandledRejection", (error) => {
    //   console.log(error);
    //   exitHandler();
    // });
  });
}

main();
