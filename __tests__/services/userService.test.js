const userService = require('../../services/userService');
const { sequelize, User } = require('../../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('User Service', () => {
  test('should create a new user', async () => {
    const user = await userService.createUser({ email: 'test@example.com', username: 'testuser', uid: '12345' });
    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });

  test('should get user by ID', async () => {
    const user = await User.create({ email: 'getbyid@example.com', username: 'getbyid', uuid: '12346' });
    const foundUser = await userService.getUserById(user.user_id);
    expect(foundUser.email).toBe('getbyid@example.com');
  });

  test('should update user details', async () => {
    const user = await User.create({ email: 'updateuser@example.com', username: 'updateuser', uuid: '12347' });
    const updatedUser = await userService.updateUser(user.user_id, { email: 'updated@example.com' });
    expect(updatedUser.email).toBe('updated@example.com');
  });

  test('should delete user', async () => {
    const user = await User.create({ email: 'deleteuser@example.com', username: 'deleteuser', uuid: '12348' });
    await userService.deleteUser(user.user_id);
    const deletedUser = await User.findOne({ where: { user_id: user.user_id } });
    expect(deletedUser).toBeNull();
  });
});
