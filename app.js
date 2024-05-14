require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

let userConfigs = [];

const cryptoExchangeAPIUrl = "https://api.exchange.com";

app.post('/register', (req, res) => {
    const userConfig = req.body;
    userConfigs.push(userConfig);
    res.send({ message: 'Configuration registered successfully' });
});

async function fetchCurrentPrice(symbol) {
    try {
        const response = await axios.get(`${cryptoExchangeAPIUrl}/price?symbol=${symbol}&apikey=${API_KEY}`);
        return response.data.price; 
    } catch (error) {
        console.error('Error fetching current price:', error);
        return null;
    }
}

async function evaluateAlerts() {
    userConfigs.forEach(async (config) => {
        const { symbol, threshold, direction, email } = config;
        const currentPrice = await fetchCurrentPrice(symbol);
    
        if (currentPrice !== null) {
            if ((direction === 'above' && currentPrice > threshold) || 
                (direction === 'below' && currentPrice < threshold)) {
                console.log(`Alert triggered for ${email}: ${symbol} is ${direction} ${threshold}`);
            }
        }
    });
}

setInterval(evaluateAlerts, 60000); 

app.listen(PORT, () => console.log(`Alert management server running on port ${PORT}`));