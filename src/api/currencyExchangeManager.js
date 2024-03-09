import axios from "axios";
//Created CurrencyExchangeManager to handle currency exchange API in separate class using Adapter Design Pattern
export default class currencyExchangeManager {
  constructor(store, startingCurrency, endingCurrency, amount) {
    this.$store = store;
    this.startingCurrency = startingCurrency;
    this.endingCurrency = endingCurrency;
    this.amount = amount;
  }

  async convertCurrency() {
    console.log('Convert currency button clicked');
    console.log('Starting currency:', this.startingCurrency);
    console.log('Ending currency:', this.endingCurrency);
    console.log('Amount:', this.amount);

    if (this.startingCurrency && this.endingCurrency && this.amount) {
      try {
        const response = await axios.get(`https://open.er-api.com/v6/latest/${this.startingCurrency}`);
        console.log('Response:', response);

        if (response.data && response.data.rates) {
          const rates = response.data.rates;

          if (this.endingCurrency in rates) {
            const conversionRate = rates[this.endingCurrency];
            console.log('Conversion rate:', conversionRate);

            // Calculate converted amount
            const convertedAmount = this.amount * conversionRate;
            console.log('Converted Amount:', convertedAmount);

            this.conversionRate = conversionRate;
            return convertedAmount;
            // Note: Use this.$store.commit if $store is a Vuex store instance
            this.$store.commit('setAlertStatus', 'alert-success');
            this.$store.commit('setAlertMessage', `Conversion successful! Converted amount: ${convertedAmount.toFixed(2)} ${this.endingCurrency}`);
            // return convertedAmount;
          } else {
            // Note: Use this.$store.commit if $store is a Vuex store instance
            this.$store.commit('setAlertStatus', 'alert-warning');
            this.$store.commit('setAlertMessage', `Conversion rate for ${this.endingCurrency} not available.`);
          }
        } else {
          console.error('Response data or rates are undefined');
        }
      } catch (error) {
        // Note: Use this.$store.commit if $store is a Vuex store instance
        this.$store.commit('setAlertStatus', 'alert-danger');
        this.$store.commit('setAlertMessage', `An error occurred while fetching conversion rates ${error.message}`);
      }
    } else {
      // Note: Use this.$store.commit if $store is a Vuex store instance
      this.$store.commit('setAlertStatus', 'alert-warning');
      this.$store.commit('setAlertMessage', 'Please select starting and ending currencies, and enter an amount to convert.');
    }
  }
};