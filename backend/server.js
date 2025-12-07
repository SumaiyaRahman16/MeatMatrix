
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/ProductRoutes'); 
const authRoutes = require('./routes/AuthRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

require('./config/db'); // Initialize DB connection


app.use(cors()); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

// Simple request logger for debugging (logs method, path and JSON body)
app.use((req, res, next) => {
    try {
        console.log(`--> ${req.method} ${req.path}`);
        if (Object.keys(req.body || {}).length) console.log('    body:', JSON.stringify(req.body));
    } catch (e) {
        console.log('    (failed to log body)');
    }
    next();
});


const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath)); 


app.use('/api/products', productRoutes); 
app.use('/api/auth', authRoutes);

// START SERVER
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`*** Test API at: http://localhost:${PORT}/api/products ***`);
});