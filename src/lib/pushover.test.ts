import { PushoverClient } from './pushover';

jest.mock('pushover-notifications');

const pushoverCredentials = {
  user: 'abcdefghijklmnopqrstuvwxyz',
  token: '1234567890',
};

const message = {
  title: 'some title',
  message: 'some message',
};

describe('pushover client', () => {
  describe('constructor', () => {
    it('initializes a pushover client', () => {
      const pushoverClient = new PushoverClient(pushoverCredentials);

      expect(pushoverClient.client).toBeDefined();
    });
  });

  describe('sendPush', () => {
    it('sends a push', async () => {
      const pushoverClient = new PushoverClient(pushoverCredentials);
      pushoverClient.client.send = jest
        .fn()
        .mockImplementation((_, callback) =>
          callback(undefined, 'some result')
        );

      const result = await pushoverClient.sendPush(message);

      expect(result).toEqual('some result');
      expect(pushoverClient.client.send).toHaveBeenCalledTimes(1);
      expect(pushoverClient.client.send).toHaveBeenCalledWith(
        message,
        expect.anything()
      );
    });

    it('rejects if there is an error', async () => {
      const pushoverClient = new PushoverClient(pushoverCredentials);
      pushoverClient.client.send = jest
        .fn()
        .mockImplementation((_, callback) =>
          callback('oh no an error!', undefined)
        );

      await expect(pushoverClient.sendPush(message)).rejects.toEqual(
        'oh no an error!'
      );
    });
  });
});
