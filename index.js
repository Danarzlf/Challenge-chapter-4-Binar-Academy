// import atau panggil package yang mau dipake diaplikasi kita
const express = require('express');
const {car} = require("./models")
const path = require("path") // untuk path join
const { Op } = require("sequelize"); //untuk model querying sequelize , jadi bisa get nama ga lengkap cth: ker ajj trus muncul data kereta
const { default: axios } = require('axios');
const routes = require('./routes') //import routes
// proses baca file json dengan fs module
//const persons = JSON.parse(fs.readFileSync(`${__dirname}/person.json`))
const bodyParser = require('body-parser')
// JSON.parse(fs.readFileSync(${__dirname}/file.json)) digunakan untuk membaca file JSON yang ada di dalam direktori file aplikasi, sedangkan body-parser digunakan untuk mem-parsing data JSON yang dikirimkan oleh client melalui request body.




//untuk upload file
const imagekit = require('./lib/imagekit')
const upload = require('./middleware/uploader')

// framework untuk http server
const app = express();
const PORT = 9000;


//public
app.use(express.static(path.join(__dirname, "public"))) //path join harus dipanggil package nya dulu diatas
app.use(express.static(path.join(__dirname, "controller")))


app.use(express.urlencoded({ extended: true})) //untuk menangani parsing data yang dikirim melalui formulir HTML menggunakan metode HTTP POST atau PUT


//middleware dalam Express yang digunakan untuk menguraikan data dari body request yang dikirimkan dalam format JSON.
//digunakan untuk mempermudah penggunaan middleware dalam Express, khususnya dalam menguraikan data yang dikirimkan dalam format JSON.
//req.body 
app.use(express.json())


app.use(routes);

//buat bootstrap yang diejs
app.use('/node_modules', express.static(__dirname + '/node_modules'));


//setting view engine
app.set("views",__dirname + "/views")
app.set("view engine", "ejs")





//ngarah index ejs .tidak sepsifik karena ada diatasnya di setting view engine
app.get('/home',(req, res) => {
    res.render("index", {
        name: 'Danar Rental',
        hello: 'Selamat Datang',
        // title: 'Hello FSQ 3 dari Client Side nih'
    })
})



//untuk tampilan data
app.get('/admin/cars', async (req, res) => {
    try {
        let cars;
        if (req.query.ukuran) {
            if (req.query.ukuran === 'Small') {
                cars = await car.findAll({
                    order: [['id', 'ASC']],
                    where: {
                        ukuran: 'Small'
                    }
                });
            } else if (req.query.ukuran === 'Medium') {
                cars = await car.findAll({
                    order: [['id', 'ASC']],
                    where: {
                        ukuran: 'Medium'
                    }
                });
            } else if (req.query.ukuran === 'Large') {
                cars = await car.findAll({
                    order: [['id', 'ASC']],
                    where: {
                        ukuran: 'Large'
                    }
                });
            } else {
                // memberikan tanggapan jika query string tidak valid
                return res.status(400).json({
                    status: 'failed',
                    message: 'Query string tidak valid'
                });
            }
        } else if (req.query.search) {
            cars = await car.findAll({
                order: [['id', 'ASC']],
                where: {
                    name: {
                        [Op.substring]: req.query.search
                    }
                }
            });
        } else {
            cars = await car.findAll({
                order: [['id', 'ASC']],
            });
        }
        res.render("cars/index", {
            cars
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        });
    }
});






//CREATE
//render html
app.get('/admin/cars/create', async (req, res) => {
    res.render("cars/create")
})
//proses create
app.post('/cars/create', upload.single('image'), async (req, res) => {
    const { name, sewa, ukuran, imageURL } = req.body
    const file = req.file
    
    // UNTUK DAPAT EXTENSION FILE
    const split = file.originalname.split('.')
    const ext = split[split.length - 1]

    // proses upload file
    const img = await imagekit.upload({
        file: file.buffer, // required
        fileName: `IMG-${Date.now()}.${ext}`,
    })

    await car.create({
        name,
        sewa,
        ukuran,
        imageURL: img.url
    })
    res.redirect(200, "/admin/cars")
})



//UPDATE
//render html
app.get('/admin/cars/edit/:id', async (req, res) => {
    const carDetail = await axios.get(`http://localhost:9000/api/cars/${req.params.id}`)
    res.render("cars/edit", {
        title: "Edit",
        carDetail: carDetail.data
    })
})

app.post('/cars/update/:id', upload.single('image'), async (req, res) => {
    const id = req.params.id
    const { name, sewa, ukuran } = req.body
    const file = req.file

    // Jika ada file gambar yang diupload, lakukan proses upload ke ImageKit
    if (file) {
        // UNTUK DAPAT EXTENSION FILE
        const split = file.originalname.split('.')
        const ext = split[split.length - 1]

        // proses upload file
        const img = await imagekit.upload({
            file: file.buffer, // required
            fileName: `IMG-${Date.now()}.${ext}`,
        })

        await car.update({
            name,
            sewa,
            ukuran,
            imageURL: img.url
        }, {
            where: {
                id
            }
        })
    } else {
        await car.update({
            name,
            sewa,
            ukuran
        }, {
            where: {
                id
            }
        })
    }

    res.redirect(200, "/admin/cars")
})




// //UPDATE
// //render html
// app.get('/admin/cars/edit/:id', async (req, res) => {
//     // const productDetail = await product.findByPk(req.params.id);
//     const carDetail = await axios.get(`http://localhost:9000/api/cars/${req.params.id}`)
//     // console.log(productDetail.data)
//     res.render("cars/edit", {
//         title: "Edit",
//         carDetail: carDetail.data
//     })
// })

// app.post('/cars/update/:id', async (req, res) => {
//     const id = req.params.id
//     const {name, sewa, ukuran , imageURL} = req.body
//     await car.update({
//         name,
//         sewa,
//         ukuran,
//         imageURL
//     }, {
//         where: {
//             id
//         }
//     })
//     res.redirect(200, "/admin/cars")
// })



//DELETE
app.post('/cars/delete/:id', async (req, res) => {
    const id = req.params.id
    await car.destroy({
        where: {
            id
        }
    })
    res.redirect(200, "/admin/cars")
})







//memulai server 
app.listen(PORT, () => {
    console.log(`App running on Localhost: ${PORT}`);
})




//YANG OP SEQUELIZE BELOM AMAN