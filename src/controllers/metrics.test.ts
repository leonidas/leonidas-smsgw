import * as assert from 'assert';
import { message, request, send } from '../helpers/test';


describe('/metrics', () => {
  describe('GET', () => {
    it('returns Prometheus metrics', async () => {
      await send(message);
      await send(message);

      const response = await request().get('/metrics').expect(200);

      assert(response.text.indexOf('smsgw_messages{customer0="leonidas", customer1="platform"} 2') >= 0);
    });
  });
});
