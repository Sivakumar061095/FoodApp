const { MongoClient } = require("mongodb");

const clientA = new MongoClient(process.env.MONGO_URI);
const clientB = new MongoClient(process.env.MONGO_URI_2);

let streamA;
let streamB;

async function startBidirectionalSync() {
  await clientA.connect();
  await clientB.connect();

  console.log(" MongoDB A & B connected");

  const collA = clientA.db("FoodApp").collection("products");
  const collB = clientB.db("FoodApp2").collection("products");

  // sync from A to B

  streamA = collA.watch([], { fullDocument: "updateLookup" });

  streamA.on("change", async (change) => {
    try {
      const id = change.documentKey._id;

      switch (change.operationType) {
        case "insert":
          if (change.fullDocument?.syncedFrom === "B") return;
          await collB.updateOne(
            { _id: id },
            {
              $set: {
                ...change.fullDocument,
                syncedFrom: "A",
                syncedAt: new Date(),
              },
            },
            { upsert: true }
          );
          console.log("A → B INSERT:", id);
          break;

        case "update":
          if (change.fullDocument?.syncedFrom === "B") return;
          await collB.updateOne(
            { _id: id },
            {
              $set: {
                ...change.fullDocument,
                syncedFrom: "A",
                syncedAt: new Date(),
              },
            },
            { upsert: true }
          );
          console.log("A → B UPDATE:", id);
          break;

        case "delete":
          await collB.deleteOne({ _id: id });
          console.log("A → B DELETE:", id);
          break;

        case "invalidate":
          console.log("Stream A invalidated");
          break;
      }
    } catch (err) {
      console.error(" A → B sync error:", err);
    }
  });

  // sync from B to A
  streamB = collB.watch([], { fullDocument: "updateLookup" });

  streamB.on("change", async (change) => {
    try {
      const id = change.documentKey._id;

      switch (change.operationType) {
        case "insert":
          if (change.fullDocument?.syncedFrom === "B") return;
          await collB.updateOne(
            { _id: id },
            {
              $set: {
                ...change.fullDocument,
                syncedFrom: "A",
                syncedAt: new Date(),
              },
            },
            { upsert: true }
          );
          console.log("A → B INSERT:", id);
          break;

        case "update":
        case "replace":
          if (!change.fullDocument || change.fullDocument.syncedFrom === "A")
            return;
          await collA.updateOne(
            { _id: id },
            {
              $set: {
                ...change.fullDocument,
                syncedFrom: "B",
                syncedAt: new Date(),
              },
            },
            { upsert: true }
          );
          console.log("B → A UPDATE:", id);
          break;

        case "delete":
          await collA.deleteOne({ _id: id });
          console.log("B → A DELETE:", id);
          break;

        case "invalidate":
          console.log("Stream B invalidated");
          break;
      }
    } catch (err) {
      console.error(" B → A sync error:", err);
    }
  });
}

async function stopSync() {
  if (streamA) await streamA.close();
  if (streamB) await streamB.close();
  await clientA.close();
  await clientB.close();
  console.log(" MongoDB connections closed");
}

module.exports = {
  startBidirectionalSync,
  stopSync,
};
