

describe('/api/v1/users', () => {
  describe('POST', () => {
    it('creates a new user');
    it('validates its input');
  });

  describe('GET', () => {
    it('returns a list of users');
    it('does not contain password hashes');
  });
});

describe('/api/v1/users/:username', () => {
  describe('GET', () => {
    it('returns user info');
    it('does not contain password hashes');
  });

  describe('DELETE', () => {
    it('deletes a user');
  });
});
