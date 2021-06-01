import { readConfig } from './config';

describe('readConfig', () => {
  it('reads environment variables to populate a config object', () => {
    process.env = {
      QBITTORRENT_HOST: 'some host',
      QBITTORRENT_PORT: '1111',
      QBITTORRENT_PROTOCOL: 'abcd',
      QBITTORRENT_USERNAME: 'some user',
      QBITTORRENT_PASSWORD: 'some secret password',
      PUSHOVER_USER: 'some pushover user',
      PUSHOVER_TOKEN: 'some pushover token',
      SCHEDULE: '* * * * *',
      CONTAINERS: 'some_container',
      DELAY_BETWEEN_RESTARTS_S: '30',
    };

    const result = readConfig();

    expect(result).toStrictEqual({
      qbittorrent: {
        host: 'some host',
        port: 1111,
        protocol: 'abcd',
        username: 'some user',
        password: 'some secret password',
      },
      pushover: {
        user: 'some pushover user',
        token: 'some pushover token',
      },
      options: {
        schedule: '* * * * *',
        containers: ['some_container'],
        delaySeconds: 30,
      },
    });
  });

  it('defaults to host localhost', () => {
    process.env.QBITTORRENT_HOST = undefined;

    const result = readConfig();

    expect(result.qbittorrent.host).toStrictEqual('localhost');
  });

  it('defaults to port 8080', () => {
    process.env.QBITTORRENT_PORT = undefined;

    const result = readConfig();

    expect(result.qbittorrent.port).toStrictEqual(8080);
  });

  it('defaults to protocol http', () => {
    process.env.QBITTORRENT_PROTOCOL = undefined;

    const result = readConfig();

    expect(result.qbittorrent.protocol).toStrictEqual('http');
  });

  it('parses multiple containers if they are separated by commas', () => {
    process.env.CONTAINERS = 'one,two,three';

    const result = readConfig();

    expect(result.options.containers).toStrictEqual(['one', 'two', 'three']);
  });

  it('does not include empty string containers', () => {
    process.env.CONTAINERS = '';

    const result = readConfig();

    expect(result.options.containers).toStrictEqual([]);
  });

  it('defaults to zero if DELAY_BETWEEN_RESTARTS_S is unset', () => {
    process.env.DELAY_BETWEEN_RESTARTS_S = undefined;

    const result = readConfig();

    expect(result.options.delaySeconds).toStrictEqual(0);
  });
});
