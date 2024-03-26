import UserVerificationAdapter from '@/api/userVerification';
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';

// mocking the authentication service calls
vi.mock('amazon-cognito-identity-js', () => ({
  AuthenticationDetails: vi.fn(),
  CognitoUserAttribute: vi.fn(),
  CognitoUserPool: vi.fn(),
  CognitoUser: vi.fn(),
}));

// mock so we can detect commit calls
vi.mock('@/main.js', () => ({
  default: {
    commit: vi.fn()
  }
}));

vi.mock('@/router/index', () => ({
  default: {
    push: vi.fn(),
  }
}));

describe('UserVerificationAdapter', () => {
  const adapter = new UserVerificationAdapter();

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('isUserSignedIn', () => {
    test('returns true if user is signed in', () => {
      adapter.userPool.getCurrentUser = vi.fn(() => ({ username: 'testuser' }));
      expect(adapter.isUserSignedIn()).toBe(true);
    });

    test('returns false if user is not signed in', () => {
      adapter.userPool.getCurrentUser = vi.fn(() => null);
      expect(adapter.isUserSignedIn()).toBe(false);
    });
  });

  describe('getUserAccount', () => {
    test('returns the username if user is signed in', () => {
      adapter.userPool.getCurrentUser = vi.fn(() => ({ username: 'testuser' }));
      expect(adapter.getUserAccount()).toBe('testuser');
    });

    test('returns an empty string if user is not signed in', () => {
      adapter.userPool.getCurrentUser = vi.fn(() => null);
      expect(adapter.getUserAccount()).toBe('');
    });
  });

  describe('createNewUser', () => {
    test('creates a new user account', async () => {
      const verifyCredentialsSpy = vi.spyOn(adapter, 'verifyCredentials');
      adapter.userPool.signUp = vi.fn((username, password, attributeList, nullValue, callback) => {
        callback(null, 'success');
      });

      await expect(adapter.createNewUser('testuser', 'password', 'test@example.com')).resolves.toBe('success');
      expect(verifyCredentialsSpy).toHaveBeenCalled();
    });

    test('rejects with an error if sign up fails', async () => {
      const verifyCredentialsSpy = vi.spyOn(adapter, 'verifyCredentials');
      const signUpMock = vi.fn((username, password, attributeList, nullValue, callback) => {
        callback(new Error('Sign up failed'), null);
      });
      adapter.userPool.signUp = signUpMock;

      await expect(adapter.createNewUser('testuser', 'password', 'test@example.com')).rejects.toThrowError('Sign up failed');
      expect(verifyCredentialsSpy).not.toHaveBeenCalled();
    });
  });

  describe('verifyCredentials', () => {
    test('authenticates user on success', async () => {
      const authenticationDetailsMock = { Username: 'testuser', Password: 'testpassword' };
      const authenticateUserMock = vi.fn((authenticationDetails, callbacks) => {
        callbacks.onSuccess({ getIdToken: vi.fn(() => ({
          payload: {
            aiKey: 'testAiKey',
            currencyKey: 'testCurrencyKey',
            locationKey: 'testLocationKey',
            translationKey: 'testTranslationKey',
            weatherKey: 'testWeatherKey',
          }
        })) });
      });

      const getCurrentUserMock = vi.fn(() => ({ username: 'testuser' }));
      adapter.userPool = {
        getCurrentUser: getCurrentUserMock
      };

      AuthenticationDetails.mockImplementation(() => authenticationDetailsMock);
      CognitoUser.mockImplementation(() => ({ authenticateUser: authenticateUserMock }));

      await adapter.verifyCredentials('testuser', 'testpassword');

      expect(AuthenticationDetails).toHaveBeenCalledWith(authenticationDetailsMock);
      expect(CognitoUser).toHaveBeenCalledWith({ Username: 'testuser', Pool: adapter.userPool });
      expect(authenticateUserMock).toHaveBeenCalledWith(authenticationDetailsMock, {
        onSuccess: expect.any(Function),
        onFailure: expect.any(Function)
      });
    });

    test('handles authentication failure', async () => {
      const authenticateUserMock = vi.fn((authenticationDetails, callbacks) => {
        callbacks.onFailure('Authentication failed');
      });

      CognitoUser.mockImplementation(() => ({ authenticateUser: authenticateUserMock }));

      await expect(adapter.verifyCredentials('testuser', 'testpassword')).rejects.toThrow('Authentication failed');

      expect(CognitoUser).toHaveBeenCalledWith({ Username: 'testuser', Pool: adapter.userPool });
      expect(authenticateUserMock).toHaveBeenCalledWith(expect.any(Object), {
        onSuccess: expect.any(Function),
        onFailure: expect.any(Function)
      });
    });
  });

  describe('signCurrentUserOut', () => {
    test('signs the current user out', () => {
      const signOutMock = vi.fn();
      const getCurrentUserMock = vi.fn(() => ({ signOut: signOutMock, username: 'testuser' }));

      adapter.userPool = {
        getCurrentUser: getCurrentUserMock
      };

      adapter.signCurrentUserOut();

      expect(getCurrentUserMock).toHaveBeenCalled();
      expect(signOutMock).toHaveBeenCalled();
    });

    test('no current user', () => {
      adapter.userPool.getCurrentUser = vi.fn(() => null);
      adapter.signCurrentUserOut();
      expect(adapter.userPool.getCurrentUser).toHaveBeenCalled()
    });
  });
});
