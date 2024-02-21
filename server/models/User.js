const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
    }
);

// Used to hash the user's password.
// A pre save hook is used to execute before saving a document.
// If the password is new or has been updated it will be hashed.
// The salt rounds are set to 10 to determine the complexity of the hash.
// this.password represents the plain text password that is replaced by the hashed version.
// Next is used to pass to the next middleware in the stack once the bcrypt library has completed the hashing process.
userSchema.pre("save", async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

// Method used to validate password on login.
userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password)
};