const express = require('express');
const expressPromiseRouter = require("express-promise-router");
const PORT = 3000;
const config = require('./knexfile');
const cors = require("cors");
const app = express();
const router = expressPromiseRouter();
const db = require('knex')(config);
const multer  = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    console.log(file)
    cb(null, Date.now() + '.jpg');
  }
});
const upload = multer({ storage });
const HOST = 'http://localhost:5000';

router.post('/upload',
  upload.single('image'), (req, res) => {
    // remove to .env and add file ext
    console.log(req.file)
    const imageUrl = `${HOST}/images/${req.file.filename}`;
    res.json({ imageUrl });
  });

router.get('/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  res.sendFile(`${__dirname}/uploads/${imageName}`);
});

router.post('/getCarsList', async(req, res) => {

  const model = db('carInstance')
    .select('carInstance.id', 'brand', 'status', 'dateOfRealise', 'innerColor', 'externalColor', 'transmission', 'price', 'photoUrl')
    .whereNull('carInstance.deletedAt')

  model.leftJoin('cars', 'carInstance.carInstanceId', 'cars.id');

  const {brand, status, dateOfRealise, innerColor, externalColor, transmission} = req.body;

  console.log(req.body)
  if (brand?.length) {
    model.whereIn('brand', brand);
  }

  if (status?.length) {
    model.whereIn('status', status);
  }

  if (dateOfRealise?.length) {
    model.whereIn('dateOfRealise', dateOfRealise);
  }

  if (innerColor?.length) {
    model.whereIn('innerColor', innerColor);
  }

  if (externalColor?.length) {
    model.whereIn('externalColor', externalColor);
  }

  if (transmission?.length) {
    model.whereIn('transmission', transmission);
  }

  const result = await model;
  console.log(result);

 res.send(result).status(200);
});

router.post('/getDetailsList', async(req, res) => {
  const model = db('detailInstance').select('*').whereNull('detailInstance.deletedAt');

  model.leftJoin('detail', 'detailInstance.carInstanceId', 'detail.id');

  const {machinePart, name} = req.body;

  if (machinePart) {
    model.whereIn('machinePart', machinePart);
  }

  if (name) {
    model.whereIn('name', name);
  }
});

router.post('/createCar', async(req, res) => {
  const {brand, status, dateOfRealise, innerColor, externalColor, transmission} = req.body;
  console.log(req.body)
  const model = db('cars').insert({
    brand,
    status,
    dateOfRealise,
    innerColor,
    externalColor,
    transmission
  });

  await model;
})

router.post('/createDetail', async(req, res) => {
  const {machinePart, name} = req.body;

  const model = db('cars').insert({
    machinePart,
    name
  });

  await model;
})

router.post('/createCarInstance', async(req, res) => {
  const {carInstanceId, price} = req.body;

  const model = db('carInstance').insert({
    carInstanceId,
    price
  })
})

router.post('/createDetailInstance', async(req, res) => {
  const {detailInstanceId, price} = req.body;

  const model = db('detailInstance').insert({
    detailInstanceId,
    price
  })
})

router.post('/createOrder', async(req, res) => {
  const {orderStaffId, orderType, userId} = req.body;

  const createdAt  = new Date();

  let orderId;

  await db.transaction(async(trx) => {
    const [{id}] =  await trx('order').insert({
      orderStaffId, orderType, userId, createdAt
    }).returning('id');

    orderId = id;

    if (orderType === 1) {
      await trx('carInstance').update({buyAt: new Date()}).where('carInstanceId', orderStaffId);
    } else {
      await trx('detailInstance').update({buyAt: new Date()}).where('detailInstanceId', orderStaffId).transaction();
    }
  })

  return {id: orderId};
});

router.post('/getOrder', async(req, res) => {
  const {orderId} = req;

  const model = await db('order').select('*').where('id', orderId).first();

  let result;

  // car = 1    detail = 2
  if (model.orderType === 1) {
    result = db('carInstanceId').leftJoin('cars', 'carInstance.carInstanceId', 'cars.id');
  } else {
    result = db('carInstanceId').leftJoin('detail', 'detailInstance.carInstanceId', 'detail.id');
  }

  result = await result.select('*');

  return result;
});

router.post('/cancelOrder', async(req, res) => {
  const {orderId} = req;

  await db('order').update({deletedAt: new Date()}).where('id', orderId);
});

router.post('/createSubscribe', async(req, res) => {
  const {userId} = req.body;
});

app.use(express.json());
app.use(cors())
app.use(router);

app.use((error, req, res, next) => {
  console.log(error)
  res.send(error).status(500);
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})