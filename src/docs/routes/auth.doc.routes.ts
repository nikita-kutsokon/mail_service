import j2s from 'joi-to-swagger';

import AuthSchema from '../../api/request-schemas/auth';

const registerUser = {
    tags: ['Authorization'],
    operationId: 'register-user',
    requestBody: {
        content: {
            'application/json': {
                schema: j2s(AuthSchema.registerSchema).swagger,
            },
        },
        required: true,
    },
    responses: {
        '201': {
            description: 'Registered successfully',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            user: {
                            type: "object", 
                            properties: {
                                email: { type: 'string', example: 'johndoe@example.com' },
                                name: { type: 'string', example: 'Dima cool' }
                            }
                        }
                        }
                        }
                    }
                },
            }
        }
    }

const loginUser = {
    tags: ['Authorization'],
    operationId: 'login-user',
    requestBody: {
        content: {
            'application/json': {
                schema: j2s(AuthSchema.loginSchema).swagger,
            },
        },
        required: true,
    },
    responses: {
        '200': {
            description: 'Logged in successfully',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            user: {
                            type: "object", 
                            properties: {
                                email: { type: 'string', example: 'johndoe@example.com' },
                                name: { type: 'string', example: 'Dima cool' }
                            }
                        },
                        token: {type: "string", example:"fijer4fiw9ei9fj3r4.eriubnfeiuhfe3uhwf.euifhnbeiufnbew"}
                        }
                        }
                },
            }
        }
    },
};

const logoutUser = {
    tags: ['Authorization'],
    parameters: [
        {
            in: 'header',
            name: "Authorization",
            description: "Bearer token",
            required: true,
            type: "string",
        }
    ],
    operationId: 'logout-user',
    responses: {
        '200': {
            description: 'Logged out successfully',
            content: {
                'text/plain': {
                    schema: {
                        type: 'string',
                        example: 'Logout success'
                    }
                }
            }
        }
    },
};

const currentCheck = {
    tags: ['Authorization'],
    parameters: [
        {
            in: 'header',
            name: "Authorization",
            description: "Bearer token",
            required: true,
            type: "string",
        }
    ],
    operationId: 'current-check',
    responses: {
        '200': {
            description: 'Token is valid',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            user: {
                            type: "object", 
                            properties: {
                                email: { type: 'string', example: 'johndoe@example.com' },
                                name: { type: 'string', example: 'Dima cool' }
                            }
                        }
                        }
                        }
                    }
                },
        }
    },
};

const routes = {
    '/api/auth/register': {
        post: registerUser,
    },
    '/api/auth/login': {
        post: loginUser,
    },
    '/api/auth/logout': {
        post: logoutUser,
    },
    '/api/auth/current': {
        get: currentCheck,
    },
};

export default routes;