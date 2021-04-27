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

  var paymentsApi = squareClient.paymentsApi;

  var payments = [];
  const listPaymentsResponse = await paymentsApi.listPayments();
  const result = listPaymentsResponse.result;
  payments = result.payments;
  var finalResult = [];
  var handledPurchases = await getHandledPurchases();
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
      "X-Total-Count": payments.length,
    },
    status: 200,
    body: JSON.stringify(finalResult),
  };
};

function getShippingAddressOrNone(shippingAddress) {
  var line1 = shippingAddress.addressLine1;
  var line2 = shippingAddress.addressLine2;
  var city = shippingAddress.locality;
  var state = shippingAddress.administrativeDistrictLevel1 || "CA";
  var zip = shippingAddress.postalCode;
  return [line1, line2, city, state, zip].filter(Boolean).join(" ");
}

async function getHandledPurchases() {
  var pass = process.env.MG_PASS;

  var uri = `mongodb+srv://canna-kool-user:${pass}@commerce-cluster.ush0w.mongodb.net/canna-kool?retryWrites=true&w=majority`;
  const mongoClient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await mongoClient.connect();
  const db = mongoClient.db("canna-kool");
  const collection = db.collection("handled-purchases");
  const cursor = collection.find({});
  var handledPurchases = [];
  await cursor.forEach((it) => {
    handledPurchases.push(it.purchaseId);
  });
  await mongoClient.close();
  return handledPurchases;
}
