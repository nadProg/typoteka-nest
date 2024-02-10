import { Repository } from 'typeorm';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import * as request from 'supertest';

import { User } from '../../src/users/entities/user.entity';

import { resetDataset } from './helpers/reset-dataset';
import { populateDataset } from './helpers/populate-dataset';
import { initUsersTestingModule } from './helpers/init-users-testing-module';

describe('Users module (e2e)', () => {
  let app: INestApplication;
  let server: App;
  let usersRepository: Repository<User>;

  beforeAll(async () => {
    ({ app, server, usersRepository } = await initUsersTestingModule());
  });

  describe('/users (POST)', () => {
    describe('valid cases', () => {
      beforeAll(async () => {
        await populateDataset({ usersRepository });
      });

      it('should create user', async () => {
        const response = await request(server).post('/users').send({
          firstName: 'first name',
          lastName: 'last name',
          email: 'created-user1@gmail.com',
          password: 'password',
          avatar: 'avatar',
        });

        expect(response.statusCode).toBe(HttpStatus.CREATED);
        expect(response.body).toEqual({
          id: 3,
          firstName: 'first name',
          lastName: 'last name',
          email: 'created-user1@gmail.com',
          avatar: 'avatar',
        });
      });

      it('should create user with required fields only', async () => {
        const response = await request(server).post('/users').send({
          firstName: 'first name',
          lastName: 'last name',
          email: 'created-user2@gmail.com',
          password: 'password',
        });

        expect(response.statusCode).toBe(HttpStatus.CREATED);
        expect(response.body).toEqual({
          id: 4,
          firstName: 'first name',
          lastName: 'last name',
          email: 'created-user2@gmail.com',
          avatar: '',
        });
      });

      it('should create user with min length text fields', async () => {
        const response = await request(server).post('/users').send({
          firstName: 'f',
          lastName: 'l',
          email: 'c@m.pl',
          password: 'passwor',
        });

        expect(response.statusCode).toBe(HttpStatus.CREATED);
        expect(response.body).toEqual({
          id: 5,
          firstName: 'f',
          lastName: 'l',
          email: 'c@m.pl',
          avatar: '',
        });
      });

      it('should create user with max length text fields', async () => {
        const response = await request(server)
          .post('/users')
          .send({
            firstName: new Array(255).fill('а').join(''),
            lastName: new Array(255).fill('а').join(''),
            email: new Array(50).fill('m').join('') + '@gmail.com',
            password: new Array(255).fill('а').join(''),
            avatar: new Array(255).fill('а').join(''),
          });

        expect(response.statusCode).toBe(HttpStatus.CREATED);
        expect(response.body).toEqual({
          id: 6,
          firstName: new Array(255).fill('а').join(''),
          lastName: new Array(255).fill('а').join(''),
          email: new Array(50).fill('m').join('') + '@gmail.com',
          avatar: new Array(255).fill('а').join(''),
        });
      });

      it('created users should be presented in users repository', async () => {
        const users = await usersRepository.find();

        expect(users).toEqual([
          {
            id: 1,
            firstName: 'first name',
            lastName: 'last name',
            email: 'user1@gmail.com',
            avatar: 'avatar',
            passwordHash: 'password',
            isAdmin: false,
          },
          {
            id: 2,
            firstName: 'first name',
            lastName: 'last name',
            email: 'user2@gmail.com',
            avatar: '',
            passwordHash: 'password',
            isAdmin: false,
          },
          {
            id: 3,
            firstName: 'first name',
            lastName: 'last name',
            email: 'created-user1@gmail.com',
            avatar: 'avatar',
            passwordHash: 'password',
            isAdmin: false,
          },
          {
            id: 4,
            firstName: 'first name',
            lastName: 'last name',
            email: 'created-user2@gmail.com',
            avatar: '',
            passwordHash: 'password',
            isAdmin: false,
          },
          {
            id: 5,
            firstName: 'f',
            lastName: 'l',
            email: 'c@m.pl',
            avatar: '',
            passwordHash: 'passwor',
            isAdmin: false,
          },
          {
            id: 6,
            firstName: new Array(255).fill('а').join(''),
            lastName: new Array(255).fill('а').join(''),
            email: new Array(50).fill('m').join('') + '@gmail.com',
            avatar: new Array(255).fill('а').join(''),
            passwordHash: new Array(255).fill('а').join(''),
            isAdmin: false,
          },
        ]);
      });

      afterAll(async () => {
        await resetDataset({ usersRepository });
      });
    });

    describe('invalid cases', () => {
      beforeAll(async () => {
        await populateDataset({ usersRepository });
      });

      describe('no body', () => {
        it('should return 400', async () => {
          const response = await request(server).post('/users');

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no created users should be presented in users repository', async () => {
          const users = await usersRepository.find();

          expect(users).toEqual([
            {
              id: 1,
              firstName: 'first name',
              lastName: 'last name',
              email: 'user1@gmail.com',
              avatar: 'avatar',
              passwordHash: 'password',
              isAdmin: false,
            },
            {
              id: 2,
              firstName: 'first name',
              lastName: 'last name',
              email: 'user2@gmail.com',
              avatar: '',
              passwordHash: 'password',
              isAdmin: false,
            },
          ]);
        });
      });

      describe('empty body', () => {
        it('should return 400', async () => {
          const response = await request(server).post('/users').send({});

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no created users should be presented in users repository', async () => {
          const users = await usersRepository.find();

          expect(users).toEqual([
            {
              id: 1,
              firstName: 'first name',
              lastName: 'last name',
              email: 'user1@gmail.com',
              avatar: 'avatar',
              passwordHash: 'password',
              isAdmin: false,
            },
            {
              id: 2,
              firstName: 'first name',
              lastName: 'last name',
              email: 'user2@gmail.com',
              avatar: '',
              passwordHash: 'password',
              isAdmin: false,
            },
          ]);
        });
      });

      describe('non-unique email', () => {
        it('should return 422', async () => {
          const response = await request(server).post('/users').send({
            firstName: 'first name',
            lastName: 'last name',
            email: 'user1@gmail.com',
            password: 'password',
            avatar: 'avatar',
          });

          expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        });

        it('no created users should be presented in users repository', async () => {
          const users = await usersRepository.find();

          expect(users).toEqual([
            {
              id: 1,
              firstName: 'first name',
              lastName: 'last name',
              email: 'user1@gmail.com',
              avatar: 'avatar',
              passwordHash: 'password',
              isAdmin: false,
            },
            {
              id: 2,
              firstName: 'first name',
              lastName: 'last name',
              email: 'user2@gmail.com',
              avatar: '',
              passwordHash: 'password',
              isAdmin: false,
            },
          ]);
        });
      });

      describe('no first name', () => {
        it('should return 400', async () => {
          const response = await request(server).post('/users').send({
            lastName: 'last name',
            email: 'created-user1@gmail.com',
            password: 'password',
            avatar: 'avatar',
          });

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no created users should be presented in users repository', async () => {
          const users = await usersRepository.find();

          expect(users).toEqual([
            {
              id: 1,
              firstName: 'first name',
              lastName: 'last name',
              email: 'user1@gmail.com',
              avatar: 'avatar',
              passwordHash: 'password',
              isAdmin: false,
            },
            {
              id: 2,
              firstName: 'first name',
              lastName: 'last name',
              email: 'user2@gmail.com',
              avatar: '',
              passwordHash: 'password',
              isAdmin: false,
            },
          ]);
        });
      });

      describe('no last name', () => {
        it('should return 400', async () => {
          const response = await request(server).post('/users').send({
            firstName: 'last name',
            email: 'created-user1@gmail.com',
            password: 'password',
            avatar: 'avatar',
          });

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no created users should be presented in users repository', async () => {
          const users = await usersRepository.find();

          expect(users).toEqual([
            {
              id: 1,
              firstName: 'first name',
              lastName: 'last name',
              email: 'user1@gmail.com',
              avatar: 'avatar',
              passwordHash: 'password',
              isAdmin: false,
            },
            {
              id: 2,
              firstName: 'first name',
              lastName: 'last name',
              email: 'user2@gmail.com',
              avatar: '',
              passwordHash: 'password',
              isAdmin: false,
            },
          ]);
        });
      });

      describe('no email', () => {
        it('should return 400', async () => {
          const response = await request(server).post('/users').send({
            firstName: 'first name',
            lastName: 'last name',
            password: 'password',
            avatar: 'avatar',
          });

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no created users should be presented in users repository', async () => {
          const users = await usersRepository.find();

          expect(users).toEqual([
            {
              id: 1,
              firstName: 'first name',
              lastName: 'last name',
              email: 'user1@gmail.com',
              avatar: 'avatar',
              passwordHash: 'password',
              isAdmin: false,
            },
            {
              id: 2,
              firstName: 'first name',
              lastName: 'last name',
              email: 'user2@gmail.com',
              avatar: '',
              passwordHash: 'password',
              isAdmin: false,
            },
          ]);
        });
      });

      describe('no password', () => {
        it('should return 400', async () => {
          const response = await request(server).post('/users').send({
            firstName: 'first name',
            lastName: 'last name',
            email: 'email@mail.com',
            avatar: 'avatar',
          });

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no created users should be presented in users repository', async () => {
          const users = await usersRepository.find();

          expect(users).toEqual([
            {
              id: 1,
              firstName: 'first name',
              lastName: 'last name',
              email: 'user1@gmail.com',
              avatar: 'avatar',
              passwordHash: 'password',
              isAdmin: false,
            },
            {
              id: 2,
              firstName: 'first name',
              lastName: 'last name',
              email: 'user2@gmail.com',
              avatar: '',
              passwordHash: 'password',
              isAdmin: false,
            },
          ]);
        });
      });

      afterAll(async () => {});
    });
  });

  afterAll(async () => {
    await resetDataset({ usersRepository });
    await app.close();
  });
});
