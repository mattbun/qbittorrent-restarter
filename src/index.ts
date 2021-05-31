import * as cron from 'node-cron';

import { readConfig } from './lib/config';
import { QBittorrentClient } from './lib/qbittorrent';
import { DockerClient } from './lib/docker';
import { checkAndRestart } from './lib/restarter';

const { qbittorrent: qbConfig, options } = readConfig();

const qbittorrent = new QBittorrentClient(qbConfig);
const docker = new DockerClient();

if (options.schedule) {
  console.info(`Running on schedule "${options.schedule}"`);

  cron.schedule(options.schedule, () => {
    checkAndRestart(qbittorrent, docker, options.containers);
  });
} else {
  console.info('No SCHEDULE specified, running once');

  checkAndRestart(qbittorrent, docker, options.containers);
}
