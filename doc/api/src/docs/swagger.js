const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description: "Documentacio de l'API del projecte e-commerce"
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' }
          }
        },
        Auth: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string' },
            password: { type: 'string' }
          }
        },
        RefreshRequest: {
          type: 'object',
          properties: {
            refreshToken: { type: 'string' }
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nom: { type: 'string' },
            descripcio: { type: 'string' }
          }
        },
        Cistella: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            productId: { type: 'string' },
            quantitat: { type: 'integer' }
          }
        },
        Comanda: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            data: { type: 'string', format: 'date-time' },
            total: { type: 'number' },
            estat: { type: 'string' }
          }
        },
        Enviament: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            comandaId: { type: 'string' },
            adreca: { type: 'string' },
            estat: { type: 'string' }
          }
        },
        Pagament: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            comandaId: { type: 'string' },
            metode: { type: 'string' },
            import: { type: 'number' },
            estat: { type: 'string' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nom: { type: 'string' },
            descripcio: { type: 'string' },
            preu: { type: 'number' },
            stock: { type: 'integer' },
            categoriaId: { type: 'string' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Registrar usuari',
          security: [],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Auth' } } }
          },
          responses: { 201: { description: 'Usuari creat' }, 400: { description: 'Dades invalides' } }
        }
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: "Login d'usuari",
          security: [],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Auth' } } }
          },
          responses: { 200: { description: 'Login correcte' }, 401: { description: 'Credencials incorrectes' } }
        }
      },
      '/api/auth/refresh': {
        post: {
          tags: ['Auth'],
          summary: 'Renovar access token',
          security: [],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RefreshRequest' } } }
          },
          responses: { 200: { description: 'Token renovat' }, 401: { description: 'Refresh invalid' } }
        }
      },
      '/api/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Tancar sessio',
          security: [],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RefreshRequest' } } }
          },
          responses: { 200: { description: 'Sessio tancada' } }
        }
      },
      '/api/user': {
        get: {
          tags: ['User'],
          summary: 'Obtenir usuaris',
          responses: { 200: { description: "Llista d'usuaris" } }
        }
      },
      '/api/user/{id}': {
        get: {
          tags: ['User'],
          summary: 'Obtenir usuari per ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Usuari trobat' }, 404: { description: 'No trobat' } }
        },
        put: {
          tags: ['User'],
          summary: 'Actualitzar usuari',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
          responses: { 200: { description: 'Usuari actualitzat' } }
        },
        delete: {
          tags: ['User'],
          summary: 'Eliminar usuari',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Usuari eliminat' } }
        }
      },
      '/api/user/{id}/role': {
        patch: {
          tags: ['User'],
          summary: 'Canviar rol usuari',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { role: { type: 'string' } } } } } },
          responses: { 200: { description: 'Rol actualitzat' } }
        }
      },
      '/api/products': {
        get: {
          tags: ['Products'],
          summary: 'Obtenir tots els productes',
          responses: { 200: { description: 'Llista de productes' } }
        },
        post: {
          tags: ['Products'],
          summary: 'Crear producte',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
          responses: { 201: { description: 'Producte creat' } }
        }
      },
      '/api/products/admin': {
        get: {
          tags: ['Products'],
          summary: 'Llistar productes (admin)',
          responses: { 200: { description: 'Llista de productes' }, 403: { description: 'No autoritzat' } }
        }
      },
      '/api/products/{id}': {
        get: {
          tags: ['Products'],
          summary: 'Obtenir producte per ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Producte trobat' }, 404: { description: 'No trobat' } }
        },
        put: {
          tags: ['Products'],
          summary: 'Actualitzar producte',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
          responses: { 200: { description: 'Producte actualitzat' } }
        },
        delete: {
          tags: ['Products'],
          summary: 'Eliminar producte',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Producte eliminat' } }
        }
      },
      '/api/categoria': {
        get: {
          tags: ['Categoria'],
          summary: 'Obtenir totes les categories',
          responses: { 200: { description: 'Llista de categories' } }
        },
        post: {
          tags: ['Categoria'],
          summary: 'Crear categoria',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } },
          responses: { 201: { description: 'Categoria creada' } }
        }
      },
      '/api/categoria/{id}': {
        get: {
          tags: ['Categoria'],
          summary: 'Obtenir categoria per ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Categoria trobada' }, 404: { description: 'No trobada' } }
        },
        put: {
          tags: ['Categoria'],
          summary: 'Actualitzar categoria',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } },
          responses: { 200: { description: 'Categoria actualitzada' } }
        },
        delete: {
          tags: ['Categoria'],
          summary: 'Eliminar categoria',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Categoria eliminada' } }
        }
      },
      '/api/cistella/{userId}': {
        get: {
          tags: ['Cistella'],
          summary: "Obtenir la cistella de l'usuari",
          parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Cistella trobada' } }
        }
      },
      '/api/cistella/afegir': {
        post: {
          tags: ['Cistella'],
          summary: 'Afegir producte a cistella',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Cistella' } } } },
          responses: { 200: { description: 'Producte afegit' } }
        }
      },
      '/api/cistella/eliminar/{itemId}': {
        delete: {
          tags: ['Cistella'],
          summary: 'Eliminar item de cistella',
          parameters: [{ name: 'itemId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Item eliminat' } }
        }
      },
      '/api/cistella/buidar/{userId}': {
        delete: {
          tags: ['Cistella'],
          summary: 'Buidar cistella',
          parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Cistella buidada' } }
        }
      },
      '/api/cistella/actualitzar': {
        put: {
          tags: ['Cistella'],
          summary: 'Actualitzar quantitat',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
          responses: { 200: { description: 'Cistella actualitzada' } }
        }
      },
      '/api/comanda': {
        get: {
          tags: ['Comanda'],
          summary: 'Obtenir totes les comandes',
          responses: { 200: { description: 'Llista de comandes' } }
        },
        post: {
          tags: ['Comanda'],
          summary: 'Crear comanda',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Comanda' } } } },
          responses: { 201: { description: 'Comanda creada' } }
        }
      },
      '/api/comanda/{id}': {
        get: {
          tags: ['Comanda'],
          summary: 'Obtenir comanda per ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Comanda trobada' }, 404: { description: 'No trobada' } }
        },
        put: {
          tags: ['Comanda'],
          summary: 'Actualitzar comanda',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
          responses: { 200: { description: 'Comanda actualitzada' } }
        },
        delete: {
          tags: ['Comanda'],
          summary: 'Eliminar comanda',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Comanda eliminada' } }
        }
      },
      '/api/comanda/checkout/create-session': {
        post: {
          tags: ['Comanda'],
          summary: 'Crear sessio checkout',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
          responses: { 200: { description: 'Sessio creada' } }
        }
      },
      '/api/comanda/checkout/webhook': {
        post: {
          tags: ['Comanda'],
          summary: 'Webhook checkout',
          security: [],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
          responses: { 200: { description: 'Webhook rebut' } }
        }
      },
      '/api/enviament': {
        get: {
          tags: ['Enviament'],
          summary: 'Obtenir tots els enviaments',
          responses: { 200: { description: "Llista d'enviaments" } }
        },
        post: {
          tags: ['Enviament'],
          summary: 'Crear enviament',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Enviament' } } } },
          responses: { 201: { description: 'Enviament creat' } }
        }
      },
      '/api/enviament/{id}': {
        get: {
          tags: ['Enviament'],
          summary: 'Obtenir enviament per ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Enviament trobat' }, 404: { description: 'No trobat' } }
        },
        put: {
          tags: ['Enviament'],
          summary: 'Actualitzar enviament',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Enviament' } } } },
          responses: { 200: { description: 'Enviament actualitzat' } }
        }
      },
      '/api/enviament/comanda/{comandaId}': {
        get: {
          tags: ['Enviament'],
          summary: 'Obtenir enviament per comanda',
          parameters: [{ name: 'comandaId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Enviament trobat' } }
        }
      },
      '/api/pagament': {
        get: {
          tags: ['Pagament'],
          summary: 'Obtenir tots els pagaments',
          responses: { 200: { description: 'Llista de pagaments' } }
        },
        post: {
          tags: ['Pagament'],
          summary: 'Crear pagament',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Pagament' } } } },
          responses: { 201: { description: 'Pagament creat' } }
        }
      },
      '/api/pagament/{id}': {
        get: {
          tags: ['Pagament'],
          summary: 'Obtenir pagament per ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Pagament trobat' }, 404: { description: 'No trobat' } }
        },
        put: {
          tags: ['Pagament'],
          summary: 'Actualitzar pagament',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Pagament' } } } },
          responses: { 200: { description: 'Pagament actualitzat' } }
        }
      },
      '/api/pagament/comanda/{comandaId}': {
        get: {
          tags: ['Pagament'],
          summary: 'Obtenir pagament per comanda',
          parameters: [{ name: 'comandaId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Pagament trobat' } }
        }
      },
      '/api/health': {
        get: {
          tags: ['System'],
          summary: 'Health check',
          security: [],
          responses: { 200: { description: 'OK' } }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
