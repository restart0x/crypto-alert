require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const CRYPTO_API_KEY = process.env.API_KEY;
const CRYPTO_API_SECRET = process.env.API_SECRET;

let alertConfigurations = [];

const cryptoExchangeApiBaseUrl = "https://api.exchange.com";

app.post('/registerAlertConfiguration', (req, res) => {
    const alertConfiguration = req.body;
    alertConfigurations.push(alertConfiguration);
    res.send({ message: 'Alert configuration registered successfully' });
});

async function fetchCryptoCurrentPrice(symbol) {
    try {
        const response = await axios.get(`${cryptoExchangeApiBaseUrl}/price?symbol=${symbol}&apikey=${CRYPTO_API_KEY}`);
        return response.data.price; 
    } catch (error) {
        console.error('Error fetching current price:', error);
        return null;
    }
}

async function checkAndTriggerAlerts() {
    alertConfigurations.forEach(async (configuration) => {
        const { symbol, threshold, direction, email } = configuration;
        const currentCryptoPrice = await fetchCryptoCurrentPrice(symbol);
    
        if (currentCryptoPrice !== null) {
            if ((direction === 'above' && currentCryptoPrice > threshold) || 
                (direction === 'below' && currentCryptoPrice < threshold)) {
                console.log(`Alert triggered for ${email}: ${symbol} is ${direction} ${threshold}`);
            }
        }
    });
}

setInterval(checkAndTriggerAlerts, 60000);

app.listen(PORT, () => console.log(`Alert management server running on port ${PORT}`));