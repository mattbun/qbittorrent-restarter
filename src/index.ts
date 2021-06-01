import * as cron from 'node-cron';

import { readConfig } from './lib/config';
import { QBittorrentClient } from './lib/qbittorrent';
import { DockerClient } from './lib/docker';
import { checkAndRestart } from './lib/restarter';
import { PushoverClient } from './lib/pushover';

const {
  qbittorrent: qbConfig,
  pushover: pushoverConfig,
  options,
} = readConfig();

const qbittorrent = new QBittorrentClient(qbConfig);
const pushover =
  pushoverConfig.user && pushoverConfig.token
    ? new PushoverClient(pushoverConfig)
    : null;
const docker = new DockerClient();

if (options.schedule) {
  console.info(`Running on schedule "${options.schedule}"`);

  cron.schedule(options.schedule, () => {
    checkAndRestart({ qbittorrent, docker, pushover }, options);
  });
} else {
  console.info('No SCHEDULE specified, running once');

  checkAndRestart({ qbittorrent, docker, pushover }, options);
}
