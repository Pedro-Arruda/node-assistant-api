import { app } from "./app";

export default async function handler(req: any, res: any) {
  await app.ready();
  app.server.emit("request", req, res);
}

async function run() {
  await app.ready();

  await app.listen({
    port: 3000,
  });

  console.log(`🚀 Server is running.`);
}

run();
