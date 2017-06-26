import * as assert from 'assert';
import { handleResultLine } from '.';


describe('handleResultLine', () => {
  it('handles well-formed result lines', () => {
    const example1 = '+358401234567 OK 1 message accepted for sending';
    const expected1 = {
      recipient: '+358401234567',
      success: true,
      statusMessage: '1 message accepted for sending',
    };
    const actual1 = handleResultLine(example1);
    assert.deepEqual(actual1, expected1);

    const example2 = '+358401234567 ERROR 3 1 message failed: Duplicate destination phone number';
    const expected2 = {
      recipient: '+358401234567',
      success: false,
      statusMessage: '3 1 message failed: Duplicate destination phone number',
    };
    const actual2 = handleResultLine(example2);
    assert.deepEqual(actual2, expected2);
  });

  it('reports non-well-formed result lines', () => {
    const example = '';
    const expected = {
      recipient: '',
      success: false,
      statusMessage: 'Unparseable result line.',
    };
    const actual = handleResultLine(example);
    assert.deepEqual(actual, expected);
  });
});
