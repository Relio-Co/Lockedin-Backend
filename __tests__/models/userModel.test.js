const { User } = require('../../models');
const sequelize = require('../../config/db');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('User Model', () => {
  test('should create a new user', async () => {
    const user = await User.create({ email: 'test@example.com', username: 'testuser', uuid: '12345' });
    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
    expect(user.username).toBe('testuser');
  });

  test('should not create a user with duplicate email', async () => {
    await User.create({ email: 'unique@example.com', username: 'uniqueuser', uuid: '12346' });
    await expect(User.create({ email: 'unique@example.com', username: 'otheruser', uuid: '12347' })).rejects.toThrow();
  });

  test('should not create a user with duplicate username', async () => {
    await User.create({ email: 'another@example.com', username: 'sameuser', uuid: '12348' });
    await expect(User.create({ email: 'another2@example.com', username: 'sameuser', uuid: '12349' })).rejects.toThrow();
  });
});
