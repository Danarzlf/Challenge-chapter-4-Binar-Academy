const { car } = require('../models') //kalo fs buat manggil file (bisa file json) kalo ini untuk database


//get all
async function getCar(req, res) {
    try {
        const carsGet = await car.findAll();
        
        res.status(200).json({
            status: 'success',
            data: {
                carsGet
            }
        });
    } catch(err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        });
    }
}

//search
async function searchCar(req, res) {
    try {
        const searchCar = await car.findAll({
            where: {
                name: {
                    [Op.substring]: req.query.name //penjelasan lengkap ada di document resmi sequelize
                }
            }
        })

        res.status(200).json({
            status: 'success',
            data: {
                searchCar
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        })
    }
}



// get by id
async function getCarById (req , res){
    try {
        //Primary Key = PK
        const id = req.params.id;
        const data = await car.findByPk(id);

        res.status(201).json({
            status: 'success',
            data : data
        })
    } catch(err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        })
    }
}



//create
async function createCar(req, res){
    try {
        const { name, sewa, ukuran, imageURL } = req.body
        const newCar = await car.create({ //await agar nunggu prosesnya beres dulu
            name,
            sewa,
            ukuran,
            imageURL
    })
    res.status(201).json({
        status: 'success',
        data: {
            car: newCar
        }
    })
    } catch(err) {
        res.status(400).json({
            status: 'error',
            message : err.message
        })
    }
}




//update
async function editCar (req , res) {
    try {
        const {name, sewa, ukuran , imageURL} = req.body;
        const id = req.params.id;
 
         await car.update({
             name,
             sewa,
             ukuran,
             imageURL
         }, {
             where: {id}
         })
 
         res.status(200).json({
             status: 'success',
             message: `data dari id ${id} nya berhasil diubah`
         })
     } catch(err) {
         res.status(404).json({
             status: 'failed',
             message: err.message
         })
     }
}


//delete
async function deleteCar (req , res){
    try {
        const id = req.params.id
        await car.destroy({
            where: {
                id
            }
        })

        res.status(200).json({
            status: 'success',
            message: `data dari id ${id} nya berhasil di hapus`
        })
    } catch(err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        })
    }
}

module.exports = {
    createCar,
    getCar,
    getCarById,
    searchCar,
    deleteCar,
    editCar,
    
}


