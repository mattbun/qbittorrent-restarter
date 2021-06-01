import * as bluebird from 'bluebird';

import { QBittorrentClient } from './qbittorrent';
import { DockerClient } from './docker';
import { PushoverClient } from './pushover';

export async function checkAndRestart(
  {
    qbittorrent,
    docker,
    pushover,
  }: {
    qbittorrent: QBittorrentClient;
    docker: DockerClient;
    pushover?: PushoverClient;
  },
  {
    containers,
    delaySeconds,
  }: {
    containers: Array<string>;
    delaySeconds: number;
  }
) {
  await qbittorrent.connect();

  const connectionStatus = await qbittorrent.getConnectionStatus();

  if (connectionStatus === 'connected') {
    console.info('qbittorrent appears to be connected, doing nothing.');
    return;
  }

  console.info(
    `qbittorrent connection status is "${connectionStatus}", restarting container(s)...`
  );

  if (pushover) {
    await pushover.sendPush({
      title: 'qbittorrent connection issue detected, restarting containers',
      message: `qbittorrent connection status is "${connectionStatus}". Restarting container(s): ${containers.join(
        ', '
      )}`,
    });
  }

  await bluebird.each(containers, async (container, index) => {
    if (index !== 0 && delaySeconds > 0) {
      console.info(
        `Waiting ${delaySeconds} seconds before restarting the next container`
      );
      await bluebird.delay(delaySeconds * 1000);
    }

    console.info(`Restarting ${container}...`);
    await docker.restartContainer(container);
  });
}
