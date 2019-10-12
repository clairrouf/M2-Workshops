
const express = require('express')
const app = express()
const InMemoryWorkshop = require('./inMemoryWorkshop')
const path = require('path')
const ejs = require('ejs')
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

// set the view engine to ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '..', '/view/ejs'))
app.use(express.static(path.join(__dirname, '..', '/view/css')))

app.get('/', function (req, res) {
  InMemoryWorkshop.getWorkshopList()
    .then(workshops => {
      res.render('index', {
        workshops: workshops
      })
    })
})

app.get('/workshop', function (req, res) {
  console.log('get')
  res.render('workshop')
})

app.get('/update-workshop/:name', function (req, res) {
  app.locals.workshopName = req.params.name;
  res.render('update-workshop')
})

app.get('/remove-workshop/:name', function (req, res) {
  const name = req.params.name
  InMemoryWorkshop.removeWorkshopByName(name)
  .then(() => {
    InMemoryWorkshop.getWorkshopList()
      .then(workshops => {
        res.redirect("/")
      })
  })
})

app.post('/workshop', function (req, res) {
  const name = req.body.name
  const description = req.body.description
  InMemoryWorkshop.addWorkshop(name, description).then(() => {
    InMemoryWorkshop.getWorkshopList()
      .then(workshops => {
        res.render('index', {
          workshops: workshops
        })
      })
  })
    .catch(e => res.send(e.message))
})

app.get('/workshop/:name', function (req, res) {
  const workshopName = req.params.name
  InMemoryWorkshop.getWorkshopByName(workshopName)
    .then(workshop => {
      res.render('ejs/workshop', workshop)
    })
    .catch(e => ejs.send(e.message))
})

app.post('/update-workshop', function (req, res) {
  const newName = req.body.newName
  const oldName = req.body.name
  InMemoryWorkshop.updateWorkshop(oldName, newName)
  .then(() => {
    InMemoryWorkshop.getWorkshopList()
      .then(workshops => {
        res.render('index', {
          workshops: workshops
        })
      })
  })
})

app.listen(3000, function () {
  console.log('Workshop app listening on port 3000!')
})
