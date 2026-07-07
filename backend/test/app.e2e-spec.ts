import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('BUS TRAVEL API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const testUser = {
      nom: 'Test User',
      email: 'test@example.com',
      telephone: '+24206123456',
      motDePasse: 'Test1234!',
    };

    it('POST /api/v1/auth/register - should register a user', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.accessToken).toBeDefined();
          expect(res.body.data.refreshToken).toBeDefined();
        });
    });

    it('POST /api/v1/auth/login - should login', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: testUser.email, motDePasse: testUser.motDePasse })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.accessToken).toBeDefined();
        });
    });

    it('POST /api/v1/auth/login - should reject wrong password', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: testUser.email, motDePasse: 'wrong' })
        .expect(401);
    });
  });

  describe('Trajets', () => {
    it('GET /api/v1/trajets - should list trajets', () => {
      return request(app.getHttpServer())
        .get('/api/v1/trajets')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data.trajets)).toBe(true);
        });
    });

    it('GET /api/v1/trajets/villes - should list villes', () => {
      return request(app.getHttpServer())
        .get('/api/v1/trajets/villes')
        .expect(200);
    });
  });

  describe('Reservations anonymes', () => {
    it('POST /api/v1/reservations/anonyme - should create anonymous reservation', () => {
      return request(app.getHttpServer())
        .post('/api/v1/reservations/anonyme')
        .send({
          trajetId: 'dummy-id',
          passagerNom: 'Jean Dupont',
          passagerEmail: 'jean@example.com',
          passagerTelephone: '+24206123456',
          dateVoyage: '2026-07-15',
          nombrePlaces: 1,
        })
        .expect(400);
    });
  });

  describe('Contact', () => {
    it('POST /api/v1/contact - should send contact message', () => {
      return request(app.getHttpServer())
        .post('/api/v1/contact')
        .send({
          nom: 'Jean Dupont',
          email: 'jean@example.com',
          sujet: 'Test',
          message: 'Ceci est un test de 10 caractères minimum',
        })
        .expect(201);
    });
  });
});
