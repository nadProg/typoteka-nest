import { CreateUserDto } from '../../../src/users/dto/create-user.dto';

export const mockCreateUserDtos: CreateUserDto[] = [
  {
    firstName: 'first name',
    lastName: 'last name',
    email: 'user1@gmail.com',
    password: 'password',
    avatar: 'avatar',
  },
  {
    firstName: 'first name',
    lastName: 'last name',
    email: 'user2@gmail.com',
    password: 'password',
  },
];
