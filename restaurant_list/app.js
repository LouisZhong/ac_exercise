//require packages used in the project
const express = require('express')
const app = express()
const port = 3000

//require express-handlebars here
const exphbs = require('express-handlebars')

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))

//route setting
app.get('/', (req, res) => {
  res.render('index')
})

//start and listen on the express server
app.listen(port, () => {
  console.log('start')
})