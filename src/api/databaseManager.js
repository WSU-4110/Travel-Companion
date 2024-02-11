import AWS from 'aws-sdk';
import store from '@/main.js';

AWS.config.update({
  accessKeyId: 'AKIAU6GD3COHK6H7SLBR',
  secretAccessKey: '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',
  region: 'us-east-1'
});

const ddb = new AWS.DynamoDB();

export function saveTrip(trip) {
  if (!tripValid(trip)) {
    throw new Error("Invalid trip");
  }

  trip.username = store.getters.getUsername;
  trip.timestamp = Date.now();

  const params = {
    TableName: "UserTrips",
    Item: AWS.DynamoDB.Converter.marshall(trip)
  };

  ddb.putItem(params, (err, data) => {
    if (err) {
      throw err;
    } else {
      console.log("Item put successfully");
    }
  });
}

export async function getAllTrips() {
  const params = {
    TableName: "UserTrips",
    KeyConditionExpression: "#username = :username",
    ExpressionAttributeNames: {
      "#username": "username"
    },
    ExpressionAttributeValues: {
      ":username": { S: store.getters.getUsername }
    }
  };

  const trips = await queryDDB(params).catch((err) => {
    console.log(err);
    throw err;
  });

  if (trips?.length === 0) {
    return null;
  }

  return trips.map(trip => AWS.DynamoDB.Converter.unmarshall(trip));
}

function tripValid(trip) {
  return trip.tripName?.length > 0;
}

function queryDDB(params) {
  return new Promise((resolve, reject) => {
    ddb.query(params, (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(data.Items);
    });
  });
}
