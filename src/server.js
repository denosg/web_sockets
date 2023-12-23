const express = require('express');
const path = require('path')
const appRoute = require('./routers/app_router')

const app = express()

const port = process.env.PORT || 3000
const publicDirPath = path.join(__dirname, '../public')

//Routes
app.use(express.static(publicDirPath))
app.use('/', appRoute);
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

module.exports = app