import * as assert from 'assert';

import { makeCustomerLabels } from './formatMetrics';


describe('makeCustomerLabels', () => {
  it('splits a dotted-path customer ID into Prometheus labels', () => {
    [
      ['leonidas', 'customer0="leonidas"'],
      ['leonidas.platform', 'customer0="leonidas", customer1="platform"'],
    ].forEach(([input, expected]) => {
      assert.equal(makeCustomerLabels(input), expected);
    });
  });
});
