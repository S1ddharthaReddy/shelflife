require("dotenv").config();

const express = require("express");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes")
const householdRoutes = require("./src/routes/householdRoutes")
const itemRoutes = require('./src/routes/itemRoutes');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes)
app.use('/api/households', householdRoutes)
app.use('/api/items', itemRoutes)

const StartServer = async () => {
    await connectDB()

    app.listen(process.env.PORT, ()=> {
        console.log(`Server is running on the port ${process.env.PORT}`)
    })
}

StartServer();