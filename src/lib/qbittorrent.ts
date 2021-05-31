import got from 'got';

export type QBTorrent = {
  name: string;
  hash: string;
  added_on: number;
};

export type ConnectionStatus = 'firewalled' | 'connected' | 'disconnected';

export type InfoBody = {
  connection_status: ConnectionStatus;
};

export class QBittorrentClient {
  baseUrl: string;
  username: string;
  password: string;
  cookie: string;

  constructor({
    host,
    port,
    protocol,
    username,
    password,
  }: {
    host: string;
    port: number;
    protocol: string;
    username: string;
    password: string;
  }) {
    this.baseUrl = `${protocol}://${host}:${port}`;
    this.username = username;
    this.password = password;
  }

  getHeaders() {
    return {
      Referer: this.baseUrl,
      Origin: this.baseUrl,
      Cookie: this.cookie,
    };
  }

  async connect() {
    const response = await got.get(`${this.baseUrl}/api/v2/auth/login`, {
      searchParams: {
        username: this.username,
        password: this.password,
      },
      responseType: 'text',
    });

    if (!response.headers['set-cookie']) {
      throw new Error('Unable to authenticate with qbittorrent');
    }

    this.cookie = response.headers['set-cookie'][0];
  }

  async getConnectionStatus() {
    const response = await got.get<InfoBody>(
      `${this.baseUrl}/api/v2/transfer/info`,
      {
        headers: this.getHeaders(),
        responseType: 'json',
      }
    );

    return response.body.connection_status;
  }
}
