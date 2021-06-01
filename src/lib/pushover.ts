import * as Pushover from 'pushover-notifications';

export class PushoverClient {
  client: Pushover;

  constructor({ user, token }: { user: string; token: string }) {
    this.client = new Pushover({ user, token });
  }

  sendPush({ title, message }: { title: string; message: string }) {
    return new Promise<void>((resolve, reject) => {
      this.client.send({ title, message }, (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      });
    });
  }
}
