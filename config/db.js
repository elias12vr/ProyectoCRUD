const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://elias12:mariobros123@xiaomi.7besd.mongodb.net//TiendadeMangas';

mongoose.connect(MONGO_URI)
.then(()=> {
    console.log('Conexion exitosa a MongoDB');
})
.catch((error)=>{
    console.error('Error al conectar con MongoDb:', error);
})