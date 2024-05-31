const { expect } = require('chai');
const rewire = require('rewire');
const dotenv = require('dotenv');
dotenv.config();

const alertingSystem = rewire('./alertingSystem');

const userConfigurations = {
  threshold: parseFloat(process.env.USER_THRESHOLD),
  comparisonMode: process.env.COMPARISON_MODE,
};

const marketConditions = [
  { price: 100, expectedAlert: userConfigurations.comparisonMode === 'above' && 100 > userConfigurations.threshold },
  { price: 50, expectedAlert: userConfigurations.comparisonMode === 'below' && 50 < userConfigurations.threshold },
  { price: userConfigurations.threshold, expectedAlert: false },
];

describe("Alerting System", function() {
  marketConditions.forEach((condition, index) => {
    it(`should ${condition.expectedAlert ? '' : 'not '}trigger an alert at price ${condition.price} (Market Condition ${index + 1})`, function() {
      alertingSystem.__set__('fetchCurrentMarketPrice', () => Promise.resolve(condition.price));
      let alertTriggered = false;
      alertingSystem.__set__('triggerAlert', () => { alertTriggered = true; });
      return alertingSystem.checkMarketConditionAndAlert(userConfigurations)
        .then(() => {
          expect(alertTriggered).to.equal(condition.expectedAlert);
        });
    });
  });
});