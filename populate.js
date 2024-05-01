require('dotenv').config()

const connectDB = require('./db/connect')
const Product = require('./models/products')

const jsonProducts = require('./products.json')

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    const count = await Product.countDocuments()
    if (count === 0) {
      await Product.create(jsonProducts)
      console.log('Database seeded successfully!')
    } else {
      console.log('Database already seeded!')
    }
   
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()
