import { Server } from "http";
// import app from "./app";
// import seedSuperAdmin from "./app/DB";
import config from "./config/index";
import { PrismaConnection } from "./app/DB/PrismaConnection";
import app from "./app";
import { createGroup } from "./app/modules/chat/chat.Service";

const port = config.port || 5000;

async function main() {
  const server: Server = app.listen(port, async () => {
    console.log("Sever is running on port ", port);
    const admin = await PrismaConnection()
    createGroup([admin?.id])
  });
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server closed!");
      });
    }
    process.exit(1);
  };

  process.on("uncaughtException", (error) => {
    console.log(error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.log(error);
    exitHandler();
  });
}

main();
