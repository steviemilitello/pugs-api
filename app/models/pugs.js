
const mongoose = require('mongoose')

const { Schema, model } = mongoose

const pugSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        owner: {
            type: String, 
            require: true
        },
        image: {
            type: String, 
            required: true
        },
        color: {
            type: String,
            required: true
        },

    }, {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
)

module.exports = model('Pug', pugSchema)