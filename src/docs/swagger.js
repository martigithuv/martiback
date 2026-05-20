const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: "Documentació de l'API del projecte e-commerce"
    },

    servers: [
      {
        url: "http://localhost:3000"
      }
    ],

    // Config autenticación con JWT
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },

      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" }
          }
        },

        Auth: {
          type: "object",
          properties: {
            email: { type: "string" },
            password: { type: "string" }
          }
        },

        Category: {
          type: "object",
          properties: {
            id: { type: "integer" },
            nom: { type: "string" },
            descripcio: { type: "string" }
          }
        },

        Cistella: {
          type: "object",
          properties: {
            id: { type: "integer" },
            usuari_id: { type: "integer" },
            producte_id: { type: "integer" },
            quantitat: { type: "integer" }
          }
        },

        Comanda: {
          type: "object",
          properties: {
            id: { type: "integer" },
            usuari_id: { type: "integer" },
            data: { type: "string", format: "date-time" },
            total: { type: "number" }
          }
        },

        Enviament: {
          type: "object",
          properties: {
            id: { type: "integer" },
            comanda_id: { type: "integer" },
            adreca: { type: "string" },
            estat: { type: "string" }
          }
        },

        Pagament: {
          type: "object",
          properties: {
            id: { type: "integer" },
            comanda_id: { type: "integer" },
            metode: { type: "string" },
            import: { type: "number" },
            estat: { type: "string" }
          }
        },

        Pedido: {
          type: "object",
          properties: {
            id: { type: "integer" },
            client_id: { type: "integer" },
            total: { type: "number" },
            estat: { type: "string" }
          }
        },

        Product: {
          type: "object",
          properties: {
            id: { type: "integer" },
            nom: { type: "string" },
            descripcio: { type: "string" },
            preu: { type: "number" },
            stock: { type: "integer" },
            categoria_id: { type: "integer" }
          }
        }
      }
    },

    security: [
      {
        bearerAuth: []
      }
    ],

    // Rutas documentadas
    paths: {
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login d'usuari",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Auth"
                }
              }
            }
          },
          responses: {
            200: {
              description: "Login correcte"
            },
            401: {
              description: "Credencials incorrectes"
            }
          }
        }
      },

      "/api/categories": {
        get: {
          tags: ["Categories"],
          summary: "Obtenir totes les categories",
          responses: {
            200: {
              description: "Llista de categories"
            }
          }
        }
      },

      "/api/cistella": {
        get: {
          tags: ["Cistella"],
          summary: "Obtenir la cistella de l'usuari",
          responses: {
            200: {
              description: "Cistella trobada"
            }
          }
        }
      },

      "/api/comandas": {
        get: {
          tags: ["Comandas"],
          summary: "Obtenir totes les comandes",
          responses: {
            200: {
              description: "Llista de comandes"
            }
          }
        }
      },

      "/api/enviaments": {
        get: {
          tags: ["Enviaments"],
          summary: "Obtenir tots els enviaments",
          responses: {
            200: {
              description: "Llista d'enviaments"
            }
          }
        }
      },

      "/api/pagaments": {
        get: {
          tags: ["Pagaments"],
          summary: "Obtenir tots els pagaments",
          responses: {
            200: {
              description: "Llista de pagaments"
            }
          }
        }
      },

      "/api/pedidos": {
        get: {
          tags: ["Pedidos"],
          summary: "Obtenir tots els pedidos",
          responses: {
            200: {
              description: "Llista de pedidos"
            }
          }
        }
      },

      "/api/products": {
        get: {
          tags: ["Products"],
          summary: "Obtenir tots els productes",
          responses: {
            200: {
              description: "Llista de productes"
            }
          }
        }
      }
    }
  },

  apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;