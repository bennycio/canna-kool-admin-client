const square = require("square")
const mongodb = require("mongodb")
const MongoClient = mongodb.MongoClient
const Client = square.Client
const Environment = square.Environment

exports.handler = async function (event, context) {
  const squareClient = new Client({
    environment: Environment.Sandbox,
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
  })

  const limit = event.queryStringParameters.limit
  const page = event.queryStringParameters.page

  console.log(limit)
  console.log(page)

  const paymentsApi = squareClient.paymentsApi

  const { result, cursor } = await paymentsApi.listPayments(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    limit
  )
  let currentResult = result
  let currentCursor = cursor

  var i
  for (i = 0; i < page; i++) {
    const { result, cursor } = await paymentsApi.listPayments(
      undefined,
      undefined,
      undefined,
      currentCursor,
      undefined,
      undefined,
      undefined,
      undefined,
      limit
    )
    currentCursor = cursor
    currentResult = result
  }

  const payments = currentResult.payments
  const finalResult = []
  const handledPurchases = await getHandledPurchases()
  payments.forEach(it => {
    if (!handledPurchases.includes(it.id) && it.shippingAddress) {
      finalResult.push({
        id: it.id,
        date: it.createdAt,
        price: Number(it.amountMoney.amount) / 100,
        address: getShippingAddressOrNone(it.shippingAddress),
      })
    }
  })

  console.log(finalResult)

  return {
    statusCode: 200,
    body: JSON.stringify(finalResult),
  }
}

function getShippingAddressOrNone(shippingAddress) {
  var line1 = shippingAddress.addressLine1
  var line2 = shippingAddress.addressLine2
  var city = shippingAddress.locality
  var state = shippingAddress.administrativeDistrictLevel1 || "CA"
  var zip = shippingAddress.postalCode
  return [line1, line2, city, state, zip].filter(Boolean).join(" ")
}

async function getHandledPurchases() {
  const pass = process.env.MONGO_PASS

  const uri = `mongodb+srv://canna-kool-user:${pass}@canna-kool.fhppp.mongodb.net/canna-kool?retryWrites=true&w=majority`
  const mongoClient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  await mongoClient.connect()
  const db = mongoClient.db("canna-kool")
  const collection = db.collection("handled-purchases")
  const cursor = collection.find({})
  var handledPurchases = []
  await cursor.forEach(it => {
    handledPurchases.push(it.purchaseId)
  })
  await mongoClient.close()
  return handledPurchases
}
