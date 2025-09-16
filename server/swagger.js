import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API MyContacts",
      version: "1.0.0",
      description: "Documentation de l’API MyContacts de Pedro Gomes",
    },
    paths: {
      "/record/test": {
        get: {
          summary: "Exemple de test d'API",
          description:
            "Retourne un message de test pour vérifier la configuration Swagger.",
          responses: {
            200: {
              description: "Réponse de test réussie",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "API Swagger opérationnelle !",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/record/addUser": {
        post: {
          summary: "Ajouter un nouvel utilisateur",
          description: "Crée un nouvel utilisateur dans la base de données.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "John" },
                    fname: { type: "string", example: "Doe" },
                    age: { type: "integer", example: 30 },
                    email: { type: "string", example: "john.doe@example.com" },
                    password: { type: "string", example: "password123" },
                  },
                },
              },
            },
          },
        },
      },
      "/record/allUsers": {
        get: {
          summary: "Récupérer tous les utilisateurs",
          description: "Retourne une liste de tous les utilisateurs.",
          responses: {
            200: {
              description: "Liste des utilisateurs récupérée avec succès",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/record/login": {
        post: {
          summary: "Connexion utilisateur",
          description:
            "Authentifie un utilisateur avec son email et mot de passe.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: {
                      type: "string",
                      example: "john.doe@example.com",
                    },
                    password: {
                      type: "string",
                      example: "password123",
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/record/editUser/{id}": {
        patch: {
          summary: "Modifier un utilisateur",
          description: "Met à jour les informations d'un utilisateur existant.",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID de l'utilisateur à modifier",
              schema: {
                type: "string",
                example: "64a7b2f5e1b2c3d4e5f67890",
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "John" },
                    fname: { type: "string", example: "Doe" },
                    age: { type: "integer", example: 31 },
                    email: { type: "string", example: "john.doe@example.com" },
                    password: { type: "string", example: "password123" },
                  },
                },
              },
            },
          },
        },
      },
      "/record/deleteUser/{id}": {
        delete: {
          summary: "Supprimer un utilisateur",
          description: "Supprime un utilisateur de la base de données.",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID de l'utilisateur à supprimer",
              schema: {
                type: "string",
                example: "64a7b2f5e1b2c3d4e5f67890",
              },
            },
          ],
        },
      },
    },
  },
  apis: [],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const swaggerUiMiddleware = [
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
];
