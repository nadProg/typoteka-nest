import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import * as request from 'supertest';
import { CategoriesModule } from '../../src/categories/categories.module';
import { TypeormTestingModule } from '../../src/typeorm/typeorm-testing.module';
import { GlobalValidationPipe } from '../../src/global/validation.pipe';

describe('Categories module (e2e)', () => {
  let app: INestApplication;
  let server: App;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CategoriesModule, TypeormTestingModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(GlobalValidationPipe);

    await app.init();

    server = app.getHttpServer();
  });

  describe('/categories (GET)', () => {
    it('should return categories', () => {
      request(server).get('/categories').expect(HttpStatus.OK).expect([]);
    });
  });

  describe('/categories (POST)', () => {
    describe('valid cases', () => {
      it('should create category', async () => {
        const response = await request(server)
          .post('/categories')
          .send({ name: 'test' });

        expect(response.statusCode).toBe(HttpStatus.CREATED);
        expect(response.body).toEqual({ id: 1, name: 'test' });
      });

      it('created category should be returned by /categories (GET)', async () => {
        const response = await request(server).get('/categories');

        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toEqual([{ id: 1, name: 'test' }]);
      });
    });

    describe('invalid cases', () => {
      describe('no body', () => {
        it('should return 400', async () => {
          const response = await request(server).post('/categories');

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no created categories should be returned by /categories (GET)', async () => {
          const response = await request(server).get('/categories');

          expect(response.statusCode).toBe(HttpStatus.OK);
          expect(response.body).toEqual([{ id: 1, name: 'test' }]);
        });
      });

      describe('empty body', () => {
        it('should return 400', async () => {
          const response = await request(server).post('/categories').send({});

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no created categories should be returned by /categories (GET)', async () => {
          const response = await request(server).get('/categories');

          expect(response.body).toEqual([{ id: 1, name: 'test' }]);
        });
      });

      describe('name with length > 30', () => {
        it('should return 400', async () => {
          const response = await request(server).post('/categories').send({
            name: '0123456789012345678901234567891',
          });

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('no created categories should be returned by /categories (GET)', async () => {
          const response = await request(server).get('/categories');

          expect(response.statusCode).toBe(HttpStatus.OK);
          expect(response.body).toEqual([{ id: 1, name: 'test' }]);
        });
      });
    });
  });

  describe('/categories (PUT)', () => {
    describe('valid cases', () => {
      it('should update category', async () => {
        const response = await request(server)
          .put('/categories/1')
          .send({ name: 'updated test' });

        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body).toEqual({ id: 1, name: 'updated test' });
      });

      it('updated category should be returned by /categories (GET)', async () => {
        const response = await request(server).get('/categories');

        expect(response.body).toEqual([{ id: 1, name: 'updated test' }]);
      });
    });

    describe('invalid cases', () => {
      describe('non existent category', () => {
        it('should return 404', async () => {
          const response = await request(server)
            .put('/categories/2')
            .send({ name: 'updated test' });

          expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
        });

        it('should not affect result returned by /categories (GET)', async () => {
          const response = await request(server).get('/categories');
          expect(response.body).toEqual([{ id: 1, name: 'updated test' }]);
        });
      });

      describe('no body', () => {
        it('should return 400', async () => {
          const response = await request(server).put('/categories/1');

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('should not affect result returned by /categories (GET)', async () => {
          const response = await request(server).get('/categories');

          expect(response.statusCode).toBe(HttpStatus.OK);
          expect(response.body).toEqual([{ id: 1, name: 'updated test' }]);
        });
      });

      describe('empty body', () => {
        it('should return 400', async () => {
          const response = await request(server).put('/categories/1').send({});

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('should not affect result returned by /categories (GET)', async () => {
          const response = await request(server).get('/categories');

          expect(response.body).toEqual([{ id: 1, name: 'updated test' }]);
        });
      });

      describe('name with length > 30', () => {
        it('should return 400', async () => {
          const response = await request(server).put('/categories/1').send({
            name: '0123456789012345678901234567891',
          });

          expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('should not affect result returned by /categories (GET)', async () => {
          const response = await request(server).get('/categories');

          expect(response.body).toEqual([{ id: 1, name: 'updated test' }]);
        });
      });
    });
  });

  describe('/categories (DELETE)', () => {
    describe('invalid cases', () => {
      describe('non existent category', () => {
        it('should return 404', async () => {
          const response = await request(server).delete('/categories/2');
          expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
        });

        it('should not affect result returned by /categories (GET)', async () => {
          const response = await request(server).get('/categories');
          expect(response.body).toEqual([{ id: 1, name: 'updated test' }]);
        });
      });
    });

    describe('valid cases', () => {
      it('should return 204', async () => {
        const response = await request(server).delete('/categories/1');
        expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);
        expect(response.body).toEqual({});
      });

      it('deleted category should not be returned by /categories (GET)', async () => {
        const response = await request(server).get('/categories');
        expect(response.body).toEqual([]);
      });
    });
  });

  afterAll(() => {
    app.close();
  });
});
