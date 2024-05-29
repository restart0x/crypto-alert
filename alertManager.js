const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

const { EMAIL_SERVICE, EMAIL_USERNAME, EMAIL_PASSWORD, EMAIL_TO, CRYPTO_API_URL } = process.env;

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD
  }
});

function sendAlertEmail(currency, price, threshold) {
  transporter.sendMail({
    from: EMAIL_USERNAME,
    to: EMAIL_TO,
    subject: `Alert: ${currency.toUpperCase()} Price Threshold Crossed`,
    text: `The ${currency.toUpperCase()} has crossed the threshold of ${threshold}. Current price is ${price}.`
  }, (error, info) => {
    if (error) {
      console.error(`Error in sending email: ${error}`);
      return;
    }
    console.log('Email sent: ' + info.response);
  });
}

async function checkCryptoPrices(userThresholds) {
  try {
    const response = await axios.get(CRYPTO_API_URL);
    if (response.status !== 200) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
    
    const cryptocurrencies = response.data;
    userThresholds.forEach(threshold => {
      const { currency, price: userPrice } = threshold;
      const marketPrice = cryptocurrencies[currency.toLowerCase()];
      
      if (!marketPrice) {
        console.error(`Price information for "${currency}" is not available.`);
        return;
      }

      if (marketPrice >= userPrice) {
        sendAlertEmail(currency, marketPrice, userPrice);
      }
    });
  } catch (error) {
    console.error(`Failed to fetch cryptocurrency prices: ${error}`);
  }
}

const userThresholds = [
  { currency: 'BTC', price: 20000 },
  { currency: 'ETH', price: 1500 }
];

setInterval(() => {
  checkCryptoPrices(userThresholds);
}, 60000);
