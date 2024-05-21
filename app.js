require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const CRYPTO_API_KEY = process.env.API_KEY;
const CRYPTO_API_SECRET = process.env.API_SECRET;
const EMAIL_SENDER = process.env.EMAIL_SENDER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

let alertConfigurations = [];

const cryptoExchangeApiBaseUrl = "https://api.exchange.com";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_SENDER,
    pass: EMAIL_PASSWORD
  }
});

app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== CRYPTO_API_SECRET) {
    return res.status(403).send({ message: 'Forbidden: Incorrect API Key' });
  }
  next();
});

const validateAlertConfig = (config) => {
  const { id, symbol, threshold, direction, email } = config;
  if (!id || !symbol || !threshold || !['above', 'below'].includes(direction) || !email) {
    return false;
  }
  return true;
};

app.post('/registerAlertConfiguration', (req, res) => {
    const alertConfiguration = req.body;
    if (!validateAlertConfig(alertConfiguration)) {
      return res.status(400).send({ message: 'Invalid alert configuration' });
    }
    if (alertConfigurations.some(config => config.id === alertConfiguration.id)) {
      return res.status(409).send({ message: 'Alert configuration already exists' });
    }
    alertConfigurations.push(alertConfiguration);
    res.send({ message: 'Alert configuration registered successfully' });
});

app.post('/removeAlertConfiguration', (req, res) => {
    const { id } = req.body; 
    alertConfigurations = alertConfigurations.filter(config => config.id !== id);
    res.send({ message: 'Alert configuration removed successfully' });
});

app.get('/listAlertConfigurations', (req, res) => {
    res.json(alertConfigurations);
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

async function sendAlertEmail(recipient, message) {
  let mailOptions = {
    from: EMAIL_SENDER,
    to: recipient,
    subject: 'Crypto Alert Notification',
    text: message
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

async function checkAndTriggerAlerts() {
    alertConfigurations.forEach(async (configuration) => {
        const { id, symbol, threshold, direction, email } = configuration;
        const currentCryptoPrice = await fetchCryptoCurrentPrice(symbol);
    
        if (currentCryptoPrice !== null) {
            if ((direction === 'above' && currentCryptoPrice > threshold) || 
                (direction === 'below' && currentCryptoPrice < threshold)) {
                console.log(`Alert triggered for ${email}: ${symbol} is ${direction} ${threshold}`);
                await sendAlertEmail(email, `Alert triggered for ${symbol}: Current price is ${direction} your threshold of ${threshold}`);
            }
        }
    });
}

setInterval(checkAndTriggerAlerts, 60000);

app.listen(PORT, () => console.log(`Alert management server running on port ${PORT}`));