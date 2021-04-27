const square = require("square");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const Client = square.Client;
const Environment = square.Environment;

exports.handler = async function (event, context) {
  const squareClient = new Client({
    environment: Environment.Sandbox,
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
  });

  const end = event.queryStringParameters._end;
  const start = event.queryStringParameters._start;

  const total = end - start;
  const page = (start % 10) + 1;
  console.log(total);
  console.log(page);

  const paymentsApi = squareClient.paymentsApi;

  var payments = [];
  const { cursor, result } = await paymentsApi.listPayments({ limit: total });
  let currentCursor = cursor;
  if (page > 1) {
    var i;
    for (i = 0; i < page; i++) {
      const { cursor, result } = await paymentsApi.listPayments({
        limit: total,
        cursor: currentCursor,
      });
      currentCursor = cursor;
      payments = result.payments;
    }
  } else {
    payments = result.payments;
  }
  let finalResult = [];
  let handledPurchases = await getHandledPurchases();
  payments.forEach((it) => {
    if (!handledPurchases.includes(it.id) && it.shippingAddress) {
      finalResult.push({
        id: it.id,
        date: it.createdAt,
        Price: Number(it.amountMoney.amount) / 100,
        Address: getShippingAddressOrNone(it.shippingAddress),
      });
    }
  });

  return {
    headers: {
      "X-Total-Count": total,
    },
    status: 200,
    body: JSON.stringify(finalResult),
  };
};

function getShippingAddressOrNone(shippingAddress) {
  let line1 = shippingAddress.addressLine1;
  let line2 = shippingAddress.addressLine2;
  let city = shippingAddress.locality;
  let state = shippingAddress.administrativeDistrictLevel1 || "CA";
  let zip = shippingAddress.postalCode;
  return [line1, line2, city, state, zip].filter(Boolean).join(" ");
}

async function getHandledPurchases() {
  const pass = process.env.MG_PASS;

  const uri = `mongodb+srv://canna-kool-user:${pass}@commerce-cluster.ush0w.mongodb.net/canna-kool?retryWrites=true&w=majority`;
  const mongoClient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await mongoClient.connect();
  const db = mongoClient.db("canna-kool");
  const collection = db.collection("handled-purchases");
  const cursor = collection.find({});
  let handledPurchases = [];
  await cursor.forEach((it) => {
    handledPurchases.push(it.purchaseId);
  });
  await mongoClient.close();
  return handledPurchases;
}
