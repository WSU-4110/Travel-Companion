import AWS from 'aws-sdk';
import { AuthenticationDetails, CognitoUserAttribute, CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import store from '@/main.js';
import router from '@/router/index';

// using the adapter design pattern - https://www.geeksforgeeks.org/adapter-pattern/
export default class UserVerificationAdapter {
  userPool;

  #poolData = {
    UserPoolId: 'us-east-1_CGVZssdaI',
    ClientId: '1ovlh593loll44qk5asirk65mt'
  };

  constructor() {
    AWS.config.region = 'us-east-1';
    this.userPool = new CognitoUserPool(this.#poolData);
  }

  // checks if the user is authorized
  isUserSignedIn() {
    return this.userPool.getCurrentUser() ? true : false;
  }

  // returns the username
  getUserAccount() {
    return this.userPool.getCurrentUser()?.username ?? "";
  }

  // created a new user account
  createNewUser(username, password, email) {
    return new Promise((resolve, reject) => {
      const attributeList = [
        new CognitoUserAttribute({
          Name: 'email',
          Value: email
        })
      ];

      this.userPool.signUp(username, password, attributeList, null, (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        this.verifyCredentials(username, password).catch((error) => {
          reject(error);
          return;
        });

        resolve(result);
      });
    });
  }

  // logs the user in
  verifyCredentials(username, password) {
    return new Promise((resolve, reject) => {
      const authenticationData = {
        Username: username,
        Password: password
      };

      const authenticationDetails = new AuthenticationDetails(authenticationData);

      const userData = {
        Username: username,
        Pool: this.userPool
      };

      const cognitoUser = new CognitoUser(userData);

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
          const aiKey = session.getIdToken().payload.aiKey;
          const currencyKey = session.getIdToken().payload.currencyKey;
          const locationKey = session.getIdToken().payload.locationKey;
          const translationKey = session.getIdToken().payload.translationKey;
          const weatherKey = session.getIdToken().payload.weatherKey;

          store.commit('setUsername', this.userPool.getCurrentUser().username);
          store.commit('setAiApiKey', aiKey);
          store.commit('setWeatherApiKey', weatherKey);
          store.commit('setLocationApiKey', locationKey);
          store.commit('setTranslationApiKey', translationKey);
          store.commit('setCurrencyApiKey', currencyKey);
          router.push('/');

          resolve(session);
        },
        onFailure: (error) => {
          store.commit('setUsername', null);
          reject(error);
        }
      });
    });
  }

  // signs the user out
  signCurrentUserOut() {
    const cognitoUser = this.userPool?.getCurrentUser();

    if (cognitoUser) {
      cognitoUser.signOut();
      console.log(cognitoUser.username, "signed out");
      store.commit('setUsername', null);
      return;
    }
  }
}
