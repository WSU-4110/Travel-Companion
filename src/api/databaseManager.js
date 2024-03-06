import AWS from 'aws-sdk';
import store from '@/main.js';

// using the adapter design pattern - https://www.geeksforgeeks.org/adapter-pattern/
export default class DatabaseAdapter {
  #ddb;

  constructor() {
    AWS.config.update({
      region: 'us-east-1',
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:afb97e84-8205-46b8-b592-e1bef5a5f00e'
      })
    });

    this.#ddb = new AWS.DynamoDB();
  }

  // saves a new trip to database
  saveTrip(trip) {
    if (!this.#tripValid(trip)) {
      throw new Error("Invalid trip");
    }

    trip.username = store.getters.getUsername;
    trip.timestamp = Date.now();

    const params = {
      TableName: 'UserTrips',
      Item: AWS.DynamoDB.Converter.marshall(trip)
    };

    this.#ddb.putItem(params, (err, data) => {
      if (err) {
        throw new Error(err);
      } else {
        console.log("Item put successfully");
      }
    });
  }

  // allows the user to update an existing trip
  updateTrip(trip) {
    deleteTrip(trip);
    saveTrip(trip);
  }

  // allows the user to delete an existing trip
  deleteTrip(trip) {
    trip = AWS.DynamoDB.Converter.marshall(trip);
    const params = {
      TableName: 'UserTrips',
      Key: {
        username: trip.username,
        timestamp: trip.timestamp
      }
    };

    this.#ddb.deleteItem(params, (err) => {
      if (err) {
        throw new Error(err);
      } else {
        console.log("Item deleted successfully");
      }
    });
  }

  // retrieves all trips for current user
  async getAllTrips() {
    const params = {
      TableName: 'UserTrips',
      KeyConditionExpression: 'username = :username',
      ExpressionAttributeValues: {
        ":username": { S: store.getters.getUsername }
      }
    };

    const trips = await this.#queryDDB(params).catch((err) => {
      console.log(err);
      throw err;
    });

    if (trips?.length === 0) {
      return null;
    }

    return trips.map(trip => AWS.DynamoDB.Converter.unmarshall(trip));
  }

  // returns whether the trip is valid or not
  #tripValid(trip) {
    return trip.tripName?.length > 0;
  }

  // the actual call to query for data in ddb
  #queryDDB(params) {
    return new Promise((resolve, reject) => {
      this.#ddb.query(params, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data.Items);
      });
    });
  }
}
