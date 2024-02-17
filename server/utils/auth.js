const jwt = requrie('jsonwebtoken');
const { GraphQLError } = require("graphql");
require('dotenv').config();

const secret = process.env.SECRET;
const expiration = process.env.EXPIRATION;

module.exports = {
    // This is created using the GraphQLError class from the graphql package.
    // This will be used in resolvers to indicate an authentication error.
    // When throwing an error in resolver functions, the error thrown will use the custom message and the error code will be UNAUTHENTICATED.
    AuthenticationError:  new GraphQLError(
        'We ran into a problem.  The user could not be authenticated.',
        {
            extensions: {
                code: 'UNAUTHENTICATED',
            },
        },
    ),
    
    // 
    authMiddleware: function({ req }) {
        // The token is extracted from the request and is saved to a variable.
        // If the token is in the header, it will extract it by splitting the header string and taking the last part after the space.
        let token = req.body.token || req.query.token || req.headers.authorization;

        if (req.headers.authorization) {
            token = token.split(" ").pop().trim();
        }

        // If no token is found the request object is returned unchanged.
        if (!token) {
            return req;
        }

        // If a token is found it will try to verify using the jwt.verify method.
        // If successfully verified, the user data is extracted from the token payload and is attached to the req.user property.
        // If invalid or verification fails, the error is caught and logged to the console.
        // After verification, the user information is attached to the request object so that it can be further processed downstream by middleware or routes.
        try {
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch (err) {
            console.error('Invalid token:', err.message);
        }

        return req;
    },

    // This function generates a JSON Web Token based on the provided username and _id.
    // A payload object containing the username and _id is created.
    // The jwt sign method is used to generate the JWT.  The first argument is the payload object.  The second is the secret key used to sign the token.  The third
    // argument is the an options object used to specify addtional configurations.  In this case it's used to set the expiration time.
    // The token string is returned after generating the token.
    signToken: function ({ username, _id }) {
        const payload = { username, _id };
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },
};