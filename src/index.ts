import * as cron from 'node-cron';

import { readConfig } from './lib/config';
import { QBittorrentClient } from './lib/qbittorrent';
import { checkAndRestart } from './lib/restarter';

const { qbittorrent: qbConfig, options } = readConfig();

const qbittorrent = new QBittorrentClient(qbConfig);

if (options.schedule) {
  console.info(`Running on schedule "${options.schedule}"`);

  cron.schedule(options.schedule, () => {
    checkAndRestart(qbittorrent, options.containers);
  });
} else {
  console.info('Running once');

  checkAndRestart(qbittorrent, options.containers);
}
