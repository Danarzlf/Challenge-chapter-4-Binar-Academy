//yang config.json diganti database.json ini

//Pada kodingan tersebut, module.exports digunakan untuk mengekspor sebuah objek yang berisi konfigurasi untuk Sequelize dengan environment development.
//Dengan mengekspor objek tersebut, maka kita dapat menggunakannya di file lain dalam project dengan cara memuat (require) file tersebut dan mengakses properti pada objek konfigurasi tersebut.

//kalau di format js tidak menggunakan kutip pada property object kalau format json pake
module.exports = {
        development: {
          username: "postgres",
          password: "Danar3112",
          database: "belajarbanget",
          host: "localhost", //pake url 127.0.0.1 juga boleh
          dialect: "postgres"   //karena kita menggunakan PostgreSQL
        }
}