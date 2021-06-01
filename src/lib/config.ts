const QBITTORRENT_DEFAULT_HOST = 'localhost';
const QBITTORRENT_DEFAULT_PORT = 8080;
const QBITTORRENT_DEFAULT_PROTOCOL = 'http';

export type QBittorrentConfig = {
  protocol: string;
  host: string;
  port: number;
  username: string;
  password: string;
};

export type PushoverConfig = {
  user: string;
  token: string;
};

export type Options = {
  schedule: string;
  containers: Array<string>;
};

export type Config = {
  qbittorrent: QBittorrentConfig;
  pushover: PushoverConfig;
  options: Options;
};

export function readConfig(): Config {
  const config = {
    qbittorrent: {
      protocol:
        process.env.QBITTORRENT_PROTOCOL || QBITTORRENT_DEFAULT_PROTOCOL,
      host: process.env.QBITTORRENT_HOST || QBITTORRENT_DEFAULT_HOST,
      port:
        parseInt(process.env.QBITTORRENT_PORT, 10) || QBITTORRENT_DEFAULT_PORT,
      username: process.env.QBITTORRENT_USERNAME,
      password: process.env.QBITTORRENT_PASSWORD,
    },
    pushover: {
      user: process.env.PUSHOVER_USER,
      token: process.env.PUSHOVER_TOKEN,
    },
    options: {
      schedule: process.env.SCHEDULE,
      containers: (process.env.CONTAINERS || '')
        .split(',')
        .filter((container) => !!container), // Don't include empty strings
    },
  };

  return config;
}
