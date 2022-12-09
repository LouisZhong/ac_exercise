//require packages used in the project
const express = require('express')
const app = express()
const port = 3000

//route setting
app.get('/', (req, res) => {
  res.send('work!')
})

//start and listen on the express server
app.listen(port, () => {
  console.log('start')
})