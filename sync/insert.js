const { MongoClient } = require("mongodb");

const clientA = new MongoClient(process.env.MONGO_URI);
const clientB = new MongoClient(process.env.MONGO_URI_2);

let streamA;
let streamB;

async function startInsertBidirectionalSync() {
  await clientA.connect();
  await clientB.connect();

  console.log("MongoDB A & B connected");

  const collA = clientA.db("FoodApp").collection("products");
  const collB = clientB.db("FoodApp2").collection("products");

  streamA = collA.watch([{ $match: { operationType: "insert" } }]);
  //a to b instert sync
  streamA.on("change", async (change) => {
    try {
      if (change.fullDocument.syncedFrom === "B") return;

      await collB.insertOne({
        ...change.fullDocument,
        syncedFrom: "A",
        syncedAt: new Date(),
      });

      console.log(" Synced INSERT A → B:", change.documentKey._id);
    } catch (err) {
      if (err.code !== 11000) {
        console.error(" A → B insert sync failed", err);
      }
    }
  });

  //b to a instert sync
  streamB = collB.watch([{ $match: { operationType: "insert" } }]);

  streamB.on("change", async (change) => {
    try {
      if (change.fullDocument.syncedFrom === "A") return;

      await collA.insertOne({
        ...change.fullDocument,
        syncedFrom: "B",
        syncedAt: new Date(),
      });

      console.log(" Synced INSERT B → A:", change.documentKey._id);
    } catch (err) {
      if (err.code !== 11000) {
        console.error(" B → A insert sync failed", err);
      }
    }
  });
}

async function stopSync() {
  if (streamA) await streamA.close();
  if (streamB) await streamB.close();
  await clientA.close();
  await clientB.close();
}

module.exports = {
  startInsertBidirectionalSync,
  stopSync,
};
