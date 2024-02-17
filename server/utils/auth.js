const jwt = requrie('jsonwebtoken');
const { GraphQLError } = require('graphql');
require('dotenv').config();

const secret = process.env.SECRET;
const expiration = "4h";

module.exports = {
    AuthenticationError:  new GraphQLError(
        'We ran into a problem.  The user could not be authenticated.',
        {
            extensions: {
                code: 'UNAUTHENTICATED',
            },
        },
    ),
    
    authMiddleware: function({ req }) {
        let token = req.body.token || req.query.token || req.headers.authorization;

        if (req.headers.authorization) {
            token = token.split(" ").pop().trim();
        }

        if (!token) {
            return req;
        }

        try {
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch (err) {
            console.error('Invalid token:', err.message);
        }

        return req;
    },

    signToken: function ({ username, _id }) {
        const payload = { username, _id };
        return jwt.sign({ data: payload }), secret, { expiresIn: expiration };
    },
};