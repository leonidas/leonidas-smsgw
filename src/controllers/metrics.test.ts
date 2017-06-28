import * as assert from 'assert';
import { message, request, send } from '../helpers/test';
import { testUsers, NewUser } from '../models/User';


function getMetrics(user: NewUser = testUsers.prometheus) {
  return request()
    .get('/metrics')
    .auth(user.username, user.password)
    .expect(200);
}


describe('/metrics', () => {
  describe('GET', () => {
    it('returns Prometheus metrics', async () => {
      await send(message);
      await send(message);

      const response = await getMetrics();

      assert(response.text.indexOf('smsgw_messages{customer0="leonidas", customer1="platform"} 2') >= 0);
    });

    it('shall work even if there are no messages', async () => {
      const response = await getMetrics();
      assert(response.text.indexOf('smsgw_messages{customer0="leonidas"} 0') >= 0);
    });
  });
});
