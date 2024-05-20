const express = require('express');
const expressPromiseRouter = require("express-promise-router");
const PORT = 3000;
const config = require('./knexfile');
const app = express();
const router = expressPromiseRouter();
const db = require('knex')(config);

router.post('/getCarsList', async(req, res) => {
 const {filter} = req.body;
});

router.post('/getDetailsList', async(req, res) => {
  const {filter} = req.body;
});

router.post('/createCar', async(req, res) => {
  const {newCar} = req.body;
})

router.post('/createDetail', async(req, res) => {
  const {newDetail} = req.body;
})

router.post('/createCarInstance', async(req, res) => {
  const {newCar} = req.body;
})

router.post('/createDetailInstance', async(req, res) => {
  const {newDetail} = req.body;
})

router.post('/createOrder', async(req, res) => {
  const {newOrder} = req;
});

router.post('/getOrder', async(req, res) => {
  const {orderId} = req;
});

router('/cancelOrder', async(req, res) => {
  const {orderId} = req;
});

router.post('/createSubscribe', async(req, res) => {
  const {userId} = req.body;
});

app.use(router);

app.use((error, req, res, next) => {
  res.status(500).send();
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})