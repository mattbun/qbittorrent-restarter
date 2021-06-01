# qbittorrent-restarter

![Docker Image Version (latest semver)](https://img.shields.io/docker/v/mattbun/qbittorrent-restarter?label=docker&sort=semver)

Restart docker containers when a qbittorrent instance isn't working.

## Getting Started (local development)

```shell
yarn install
yarn build
yarn start
```

## Getting Started (using docker-compose)

A docker image is provided [here](https://hub.docker.com/r/mattbun/qbittorrent-restarter).

```yaml
services:
  qbittorrent-restarter:
    container_name: qbittorrent-restarter
    image: mattbun/qbittorrent-restarter
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - SCHEDULE=0 * * * *
      - CONTAINERS=qbittorrent,another-container
      - PUSHOVER_USER=abcdefghijklmnopqrstuvwxyz
      - PUSHOVER_TOKEN=1234567890
      - QBITTORRENT_HOST=1.2.3.4
      - QBITTORRENT_USERNAME=my_user
      - QBITTORRENT_PASSWORD=secretsecret
```

## Configuration

Configuration options are passed via environment variables. Available options are listed below:

| Name | Default | Description |
|---|---|---|
| SCHEDULE | | Cron string to run on a schedule, see [here](https://www.npmjs.com/package/node-cron) for syntax. If not provided, qbittorrent-restarter will run once and exit |
| CONTAINERS | | A comma-separated list of containers to restart. Containers will be restarted in the same order |
| DELAY_BETWEEN_RESTARTS_S | `0` | Delay for a certain amount of time between restarting containers, useful if one container depends on another |
| QBITTORRENT_HOST | `localhost` | The hostname or IP address of the qbittorrent server  |
| QBITTORRENT_PORT | `8080` | The port to use when communicating with the qbittorrent server |
| QBITTORRENT_PROTOCOL | `http` | The protocol to use when communicating with the qbittorrent server (`http` or `https`) |
| QBITTORRENT_USERNAME | | The username to use when authenticating with qbittorrent |
| QBITTORRENT_PASSWORD | | The password to use when authenticating with qbittorrent |
| PUSHOVER_USER | | Pushover user to send notifications to |
| PUSHOVER_TOKEN | | Pushover token to use to send notifications |

