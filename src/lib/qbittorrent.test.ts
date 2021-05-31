import got from 'got';

import { QBittorrentClient } from './qbittorrent';

const connectionOptions = {
  protocol: 'http',
  host: 'some.host',
  port: 8675,
  username: 'some user',
  password: 'secret password',
};

const mockTorrents = [
  {
    hash: 'abc',
    name: 'def',
    added_on: 1,
  },
  {
    hash: 'ghi',
    name: 'jkl',
    added_on: 10,
  },
];

describe('qbittorrent client', () => {
  describe('constructor', () => {
    it('initializes a qbittorrent client', () => {
      const client = new QBittorrentClient(connectionOptions);

      expect(client.baseUrl).toStrictEqual('http://some.host:8675');
      expect(client.username).toStrictEqual('some user');
      expect(client.password).toStrictEqual('secret password');
    });
  });

  describe('connect', () => {
    it('authenticates with qbittorrent', async () => {
      jest.spyOn(got, 'get').mockResolvedValue({
        headers: {
          'set-cookie': ['some cookie'],
        },
      });
      const client = new QBittorrentClient(connectionOptions);

      await client.connect();

      expect(got.get).toHaveBeenCalledTimes(1);
      expect(got.get).toHaveBeenCalledWith(
        `${client.baseUrl}/api/v2/auth/login`,
        {
          searchParams: {
            username: connectionOptions.username,
            password: connectionOptions.password,
          },
          headers: {
            Referer: client.baseUrl,
            Origin: client.baseUrl,
          },
          responseType: 'text',
        }
      );
      expect(client.cookie).toStrictEqual('some cookie');
    });

    it('throws an error if authentication failed', async () => {
      jest.spyOn(got, 'get').mockResolvedValue({
        headers: {},
      });
      const client = new QBittorrentClient(connectionOptions);

      expect(() => client.connect()).rejects.toThrow(
        'Unable to authenticate with qbittorrent'
      );
    });
  });

  describe('getConnectionStatus', () => {
    it('gets connection status', async () => {
      jest.spyOn(got, 'get').mockResolvedValue({
        body: {
          connection_status: 'connected',
        },
      });
      const client = new QBittorrentClient(connectionOptions);

      const result = await client.getConnectionStatus();

      expect(result).toEqual('connected');
    });
  });
});
