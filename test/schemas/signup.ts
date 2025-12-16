export const signupSchema = {
    body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
            username: {type: 'string', format: 'email'},
            password: {type: 'string', minLength: 6}
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                message: {type: 'string'},
                token: {type: 'string'},
                user: {
                    type: 'object',
                    properties: {
                        username: {type: 'string'}
                    }
                }
            }
        }
    }
}