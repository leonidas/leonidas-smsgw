import * as assert from 'assert';

import isValidCustomer from './isValidCustomer';


describe('isValidCustomer', () => {
  it('passes valid customers', () => {
    [
      'leonidas',
      'leonidas.platform',
      'leonidas.plat2',
      'hyphens-are-cool.yeah-right',
    ].forEach((customer) => assert(isValidCustomer(customer), customer));
  });

  it('fails invalid customers', () => {
    [
      '',
      'leonidas".platform',
      'underscores_are_not_cool',
      'ending.in.a.dot.',
    ].forEach((customer) => assert(!isValidCustomer(customer), customer));
  });
});
