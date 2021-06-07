const mongodb = require("mongodb")
const MongoClient = mongodb.MongoClient

exports.handler = async function (event, context) {
  const body = event.body

  const asJson = JSON.parse(body)

  const result = await addHandledPurchases(asJson.ids)

  console.log(result)

  return { statusCode: 200 }
}

async function addHandledPurchases(ids) {
  const pass = process.env.MONGO_PASS

  const uri = `mongodb+srv://canna-kool-user:${pass}@canna-kool.fhppp.mongodb.net/canna-kool?retryWrites=true&w=majority`
  const mongoClient = new MongoClient(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  await mongoClient.connect()
  const db = mongoClient.db("canna-kool")
  const collection = db.collection("handled-purchases")
  const docs = []
  ids.forEach(it => {
    docs.push({ purchaseId: it })
  })
  const result = await collection.insertMany(docs)
  await mongoClient.close()
  return result
}
