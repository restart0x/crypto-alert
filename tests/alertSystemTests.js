const { expect } = require('chai');
const rewire = require('rewire');
const dotenv = require('dotenv');
dotenv.config();

const alertingSystem = rewire('./alertingSystem');

const userConfigurations = {
  threshold: parseFloat(process.env.USER_THRESHOLD),
  comparisonMode: process.env.COMPARISON_MODE,
};

const marketPrices = [100, 50, userConfigurations.threshold];
const shouldAlert = (price, { threshold, comparisonMode }) => {
  return (comparisonMode === 'above' && price > threshold) || 
         (comparisonVmode === 'below' && price < threshold);
};

describe("Alerting System", function() {
  marketPrices.forEach((price) => {
    const expectedAlert = shouldAlert(price, userConfigurations);
    it(`should ${expectedAlert ? '' : 'not '}trigger an alert at price ${price}`, function() {
      alertingSystem.__set__('fetchCurrentMarketPrice', () => Promise.resolve(price));
      let alertTriggered = false;
      alertingSystem.__set__('triggerAlert', () => { alertTriggered = true; });
      return alertingSystem.checkMarketConditionAndAlert(userConfigurations)
        .then(() => {
          expect(alertTriggered).to.equal(expectedAlert);
        });
    });
  });
});