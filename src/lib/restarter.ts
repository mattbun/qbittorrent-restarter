import * as bluebird from 'bluebird';

import { QBittorrentClient } from './qbittorrent';
import { DockerClient } from './docker';

export async function checkAndRestart(
  qbittorrentClient: QBittorrentClient,
  dockerClient: DockerClient,
  containers: Array<string>
) {
  await qbittorrentClient.connect();

  const connectionStatus = await qbittorrentClient.getConnectionStatus();

  if (connectionStatus === 'connected') {
    console.info('qbittorrent appears to be connected, doing nothing.');
    return;
  }

  console.info(
    `qbittorrent connection status is "${connectionStatus}", restarting containers...`
  );

  await bluebird.each(containers, async (container) => {
    console.info(`Restarting ${container}...`);
    await dockerClient.restartContainer(container);
  });
}
