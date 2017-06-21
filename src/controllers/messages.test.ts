//import * as assert from 'assert';

import { message, send } from '../helpers/test';


describe('/api/v1/messages', () => {
  describe('POST', () => {
    it('sends SMS', () => send(message).expect(200));
    it('validates its input', () => send({}).expect(400));
  });
});
