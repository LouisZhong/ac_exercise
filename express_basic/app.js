// Include express from node_modules
const express = require('express')
const app = express()

// Define server related variables
const port = 3000

// Handle request and response here
app.get('/', (req, res) => {
  res.send(`This is my first Express Web App haha`)
})

app.get('/food', (req, res) => {
  res.send(`my favorite food is cake`)
})

// change into dynamic routes with params ':language'
app.get('/jav/category/:category', (req, res) => {
  console.log('request', req.params.category)
  res.send(`<h1>${req.params.category} video is JAV</h1>`)
})

// Start and listen the server
app.listen(port, () => {
  console.log(`Express is now now running on http://localhost:${port}`)
})