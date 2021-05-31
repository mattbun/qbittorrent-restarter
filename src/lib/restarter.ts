import { QBittorrentClient } from './qbittorrent';

export async function checkAndRestart(
  qbittorrentClient: QBittorrentClient,
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

  // TODO restart containers
}
