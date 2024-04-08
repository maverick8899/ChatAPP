const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ChatAPP CRUD REST API',
            version: '1.0.0',
            description:
                'This is a simple CRUD API application made with Express and documented with Swagger',
        },
        servers: [
            {
                url: 'http://localhost:8080/chat/',
                description: 'Development server',
            },
        ],
        components: {
            schemas: {
                Chats: {
                    type: 'object',
                    required: ['chatName', 'isGroupChat', 'users', 'latestMessage', 'groupAdmin'],
                    properties: {
                        chatName: {
                            type: 'string',
                            description: 'The name of the chat',
                        },
                        isGroupChat: {
                            type: 'boolean',
                            default: false,
                            description: 'Indicates if the chat is a group chat',
                        },
                        users: {
                            type: 'array',
                            items: {
                                type: 'object',
                                description: 'The reference to a User',
                            },
                            description: 'The array of user references participating in the chat',
                        },
                        latestMessage: {
                            type: 'string',
                            description: 'The reference to the latest message in the chat',
                        },
                        groupAdmin: {
                            type: 'string',
                            description: 'The reference to the group admin User',
                        },
                    },
                },
            },
            responses: {
                400: {
                    description: 'Missing API key - include it in the Authorization header',
                    contents: 'application/json',
                },
                401: {
                    description: 'Unauthorized - incorrect API key or incorrect format',
                    contents: 'application/json',
                },
                404: {
                    description: 'Not found - the book was not found',
                    contents: 'application/json',
                },
            },
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                },
            },
        },
        security: [
            {
                ApiKeyAuth: [],
            },
        ],
    },
    apis: ['./src/api/v1/routes/v1/*.js'],
};

module.exports = options;
