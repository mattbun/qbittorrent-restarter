import * as Docker from 'dockerode';

export class DockerClient {
  client: Docker;

  constructor() {
    this.client = new Docker();
  }

  async restartContainer(containerName: string) {
    const container = this.client.getContainer(containerName);

    if (!container) {
      throw new Error(`could not find container ${containerName}`);
    }

    await container.restart();
  }
}
