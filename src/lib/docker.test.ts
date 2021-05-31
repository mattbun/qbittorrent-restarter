import got from 'got';

import { DockerClient } from './docker';

describe('docker client', () => {
  describe('constructor', () => {
    it('initializes a docker client', () => {
      const dockerClient = new DockerClient();

      expect(dockerClient.client).toBeDefined();
    });
  });

  describe('restartContainer', () => {
    it('restarts a container', async () => {
      const dockerClient = new DockerClient();
      const container = {
        restart: jest.fn(),
      };
      dockerClient.client = {
        getContainer: jest.fn().mockReturnValue(container),
      } as any;

      const result = await dockerClient.restartContainer('blah');

      expect(container.restart).toHaveBeenCalledTimes(1);
    });

    it('throws an error if the container cannot be found', async () => {
      const dockerClient = new DockerClient();
      dockerClient.client = {
        getContainer: jest.fn().mockReturnValue(undefined),
      } as any;

      expect(dockerClient.restartContainer('blah')).rejects.toThrow();
    });
  });
});
