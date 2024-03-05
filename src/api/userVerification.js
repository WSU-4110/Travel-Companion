import AWS from 'aws-sdk';
import { AuthenticationDetails, CognitoUserAttribute, CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import store from '@/main.js';
import router from '@/router/index';

AWS.config.region = 'us-east-1';

const poolData = {
  UserPoolId: 'us-east-1_CGVZssdaI',
  ClientId: '1ovlh593loll44qk5asirk65mt'
};

const userPool = new CognitoUserPool(poolData);

export function isUserSignedIn() {
  return userPool.getCurrentUser() ? true : false;
}

export function getUserAccount() {
  return userPool.getCurrentUser()?.username ?? "";
}

export function createNewUser(username, password, email) {
  return new Promise((resolve, reject) => {
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email
      })
    ];

    userPool.signUp(username, password, attributeList, null, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      verifyCredentials(username, password).catch((error) => {
        reject(error);
        return;
      });

      resolve(result);
    });
  });
}

export function verifyCredentials(username, password) {
  return new Promise((resolve, reject) => {
    const authenticationData = {
      Username: username,
      Password: password
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
      Username: username,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session) => {
        const currencyKey = session.getIdToken().payload.currencyKey;
        const locationKey = session.getIdToken().payload.locationKey;
        const translationKey = session.getIdToken().payload.translationKey;
        const weatherKey = session.getIdToken().payload.weatherKey;

        store.commit('setUsername', userPool.getCurrentUser().username);
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

export function signCurrentUserOut() {
  const cognitoUser = userPool?.getCurrentUser();

  if (cognitoUser) {
    cognitoUser.signOut();
    console.log(cognitoUser.username, "signed out");
    store.commit('setUsername', null);
    return;
  }
}
