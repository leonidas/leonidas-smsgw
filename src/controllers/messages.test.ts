import * as assert from 'assert';

import { message, send } from '../helpers/test';
import Result from '../models/Result';


describe('/api/v1/messages', () => {
  describe('POST', () => {
    it('sends SMS', async () => {
      const response = await send(message).expect(201);

      const result: Result = response.body;
      assert(result.success);
      assert.equal(result.recipients.length, 1);

      const recipientResult = result.recipients[0];
      assert.equal(recipientResult.recipient, message.recipients[0]);
      assert(recipientResult.success);
    });

    it('validates its input', () => send({}).expect(400));
  });
});
