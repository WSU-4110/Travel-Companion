import DatabaseAdapter from '@/api/databaseManager';

// mocking the databse calls to prevent actual reads and writes
vi.mock('aws-sdk', () => ({
  default: class AWS {
    static config = {
      update: vi.fn()
    };
    static CognitoIdentityCredentials = vi.fn();
    static DynamoDB = class DynamoDB {
      static Converter = {
        marshall: vi.fn((trip) => ({username: trip.username, tripName: trip.tripName, timestamp: trip.timestamp})),
        unmarshall: vi.fn((trip) => ({username: trip.username, tripName: trip.tripName}))
      };
      putItem = vi.fn();
      deleteItem = vi.fn();
      query = vi.fn();
    };
  }
}));

// mock return a username
vi.mock('@/main.js', () => ({
  default: {
    getters: {
      getUsername: 'testuser',
    }
  }
}));

describe('DatabaseAdapter', () => {
  const adapter = new DatabaseAdapter();

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('saveTrip', () => {
    const putSpy = vi.spyOn(adapter.ddb, "putItem");

    test('should save a trip to the database', () => {
      const trip = { tripName: 'Test Trip' };
      adapter.saveTrip(trip);

      expect(putSpy).toHaveBeenCalledWith(expect.objectContaining({
          TableName: 'UserTrips',
          Item: expect.objectContaining({username: "testuser", tripName: "Test Trip"})
        }), expect.anything());
    });

    test('should throw an error for invalid trip', () => {
      const trip = { tripName: '' };

      expect(putSpy).not.toHaveBeenCalled();
      expect(() => adapter.saveTrip(trip)).toThrow('Invalid trip');
    });
  });

  describe('deleteTrip', () => {
    const deleteSpy = vi.spyOn(adapter.ddb, "deleteItem");

    test('should delete a trip from the database', () => {
      const trip = { tripName: 'Test Trip', username: 'testuser', timestamp: 123};
      adapter.deleteTrip(trip);

      expect(deleteSpy).toHaveBeenCalledWith(expect.objectContaining({
        TableName: 'UserTrips',
        Key: expect.objectContaining({timestamp: 123, username: "testuser"})
      }), expect.anything());
    });
  });

  describe('getAllTrips', () => {
    const querySpy = vi.spyOn(adapter.ddb, "query");

    test('should retrieve all trips for current user', async () => {
      const mockItems = [{ tripName: 'Test Trip 1' }, { tripName: 'Test Trip 2' }];
      adapter.ddb.query.mockImplementation((params, callback) => {
        callback(null, { Items: mockItems });
      });

      const trips = await adapter.getAllTrips();

      expect(trips).toEqual(mockItems);
      expect(querySpy).toHaveBeenCalledWith(expect.objectContaining({
        TableName: "UserTrips", KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: {
          ':username': { 'S': 'testuser' }
        }
      }), expect.anything());
    });

    test('should return null if no trips found for current user', async () => {
      adapter.ddb.query.mockImplementation((params, callback) => {
        callback(null, { Items: [] });
      });
      const trips = await adapter.getAllTrips();

      expect(trips).toBeNull();
      expect(querySpy).toHaveBeenCalled();
    });

    test('should throw an error if query fails', async () => {
      const mockError = new Error('Query error');
      adapter.ddb.query.mockImplementation((params, callback) => {
        callback(mockError);
      });

      await expect(adapter.getAllTrips()).rejects.toThrow(mockError);
      expect(querySpy).toHaveBeenCalled();
    });
  });
});
