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
      console.error(`Error in sending email for ${currency}: ${error.message}`);
      return;
    }
    console.log(`Email sent for ${currency}: ` + info.response);
  });
}

async function checkCryptoPrices(userThresholds) {
  try {
    const response = await axios.get(CRYPTO_API_URL);
    if (response.status !== 200) {
      console.error(`Unexpected response status while fetching prices: ${response.status}`);
      return; 
    }

    const cryptocurrencies = response.data;
    userThresholds.forEach(threshold => {
      const { currency, price: userPrice } = threshold;
      if (!cryptocurrencies.hasOwnProperty(currency.toLowerCase())) {
        console.error(`Price information for "${currency}" is not available or not found.`);
        return; 
      }

      const marketPrice = cryptocurrencies[currency.toLowerCase()];

      if (marketPrice >= userPrice) {
        sendAlertEmail(currency, marketPrice, userPrice);
      }
    });
  } catch (error) {
    if (error.response) {
      console.error(`Failed to fetch cryptocurrency prices: ${error.response.data.message}, Status code: ${error.response.status}`);
    } else if (error.request) {
      console.error(`Failed to fetch cryptocurrency prices, No response received: ${error.request}`);
    } else {
      console.error(`Failed to fetch cryptocurrency prices, Error in setup: ${error.message}`);
    }
  }
}

const userThresholds = [
  { currency: 'BTC', price: 20000 },
  { currency: 'ETH', price: 1500 }
];

setInterval(() => {
  checkCryptoPrices(userTriangles);
}, 60000);