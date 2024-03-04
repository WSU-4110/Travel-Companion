<template>
    <div>
      <div class="text-center">
        <h1 class="display-7">Currency Exchange</h1>
      </div>

      <div class="text-center">
        <div class="btn-group">
          <select v-model="startingCurrency" class="form-select form-select-lg mb-3" style="width:300px">
            <option value="" disabled>Select Starting Currency</option>
            <option v-for="(currency, index) in currencies" :key="index" :value="currency">{{ currency }}</option>
          </select>
          &ensp;&ensp;
          <select v-model="endingCurrency" class="form-select form-select-lg mb-3" style="width:300px">
            <option value="" disabled>Select Ending Currency</option>
            <option v-for="(currency, index) in currencies" :key="index" :value="currency">{{ currency }}</option>
          </select>
        </div>
      </div>

      <div class="text-center">
        <div class="btn-group">
          <div class="input-group mb-3">
            <span class="input-group-text">$</span>
            <input v-model.number="amount" type="number" class="form-control" aria-label="Amount (to the nearest dollar)">
            <span class="input-group-text">.00</span>
          </div>
          &ensp;&ensp;
          <div class="input-group mb-3">
            <input :value="convertedAmount" type="text" class="form-control" aria-label="Amount (to the nearest dollar)" disabled readonly>
            <span class="input-group-text">.00</span>
          </div>
        </div>
      </div>

      <div class="text-center">
        <button @click="convertCurrency" type="button" class="btn btn-primary"
          style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: 7.5rem; --bs-btn-font-size: 2rem;">
          Convert
        </button>
      </div>
    </div>
  </template>

  <script>
  import axios from 'axios';

  export default {
    data() {
      return {
        startingCurrency: '',
        endingCurrency: '',
        amount: 0,
        conversionRate: null,
        currencies : [ "AUD","BGN","BRL","CAD","CHF","CNY","CZK","DKK","EUR","GBP","HKD","HRK","HUF","IDR","ILS","INR","ISK","JPY","KRW","MXN","MYR","NOK","NZD","PHP","PLN","RON","RUB","SEK","SGD","THB","TRY","USD","ZAR"]
      };
    },
    computed: {
      convertedAmount() {
        if (this.conversionRate && this.amount) {
          return (this.amount * this.conversionRate).toFixed(2);
        } else {
          return '0.00';
        }
      }
    },
    methods: {
        async convertCurrency() {
        console.log('Convert currency button clicked');
        console.log('Starting currency:', this.startingCurrency);
        console.log('Ending currency:', this.endingCurrency);
        console.log('Amount:', this.amount);

  if (this.startingCurrency && this.endingCurrency && this.amount) {
    try {
      const response = await axios.get(`https://api.freecurrencyapi.com/v1/latest?apikey=${this.$store.getters.getCurrencyApiKey}&currencies=${this.endingCurrency}`);
      console.log('Response:', response);

      if (response.data && response.data.data) {
        const rates = response.data.data;
        if (this.endingCurrency in rates) {
          this.conversionRate = rates[this.endingCurrency];
          console.log('Conversion rate:', this.conversionRate);
        } else {
          this.$store.commit('setAlertStatus', 'alert-warning');
          this.$store.commit('setAlertMessage', `Conversion rate for ${this.endingCurrency} not available.`);
        }
      } else {
        console.error('Response data or rates are undefined');
      }
    } catch (error) {
      this.$store.commit('setAlertStatus', 'alert-danger');
      this.$store.commit('setAlertMessage', `An error occurred while fetching conversion rates ${error.message}`);
    }
  } else {
    this.$store.commit('setAlertStatus', 'alert-warning');
    this.$store.commit('setAlertMessage', 'Please select starting and ending currencies, and enter an amount to convert.');
  }
}}}

</script>
<style>
</style>
