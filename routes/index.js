const router = require('express').Router();

const carController = require('../controller/carController')

//API
router.get('/cars', carController.getCar)

router.get('/cars/search', carController.searchCar)

router.get('/api/cars/:id', carController.getCarById)

router.put('/cars/:id', carController.editCar)

router.delete('/cars/:id', carController.deleteCar)

router.post('/api/cars', carController.createCar)

module.exports = router