require('dotenv').config();
const express = require('express');
const { connectDB } = require('./src/config/database');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
res.json({ success: true, message: 'SmartMargin API v1.0' });
});
const start = async () => {
await connectDB();
app.listen(PORT, () => {
console.log(`Servidor en puerto ${PORT}`);
});
};
start();