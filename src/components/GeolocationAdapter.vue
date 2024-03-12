<!-- GeolocationAdapter.vue -->
<template>
    <div></div>
  </template>
  
  <script>
  export default {
    name: 'GeolocationAdapter',
    data() {
      return {};
    },
    methods: {
      getCurrentPosition(successCallback, errorCallback) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;
              successCallback(latitude, longitude);
            },
            error => {
              errorCallback(error.message);
            }
          );
        } else {
          errorCallback('Your browser does not support geolocation API');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add your component styles here */
  </style>
  