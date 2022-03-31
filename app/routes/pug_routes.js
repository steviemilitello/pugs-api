// import our dependencies, middleware and models 
const express = require('express')
const passport = require('passport')

// pull in our model
const Pug = require('../models/pugs')

// helps us detect certain situations and send custom errors
const customErrors = require('../../lib/custom_errors')
// this function sends a 404 when non-existent document is requested
const handle404 = customErrors.handle404
// middleware that can send a 401 when a user tries to access something they do not own
const requireOwnership = customErrors.requireOwnership
// requireToken is passed as a second arg to router.<verb> 
// makes it so that a token MUST be passed for that route to be available --> also sets 'req.user'
const requireToken = passport.authenticate('bearer', { session: false })
// this middleware removes any blank fields from req.body
const removeBlanks = require('../../lib/remove_blank_fields')

// instantiate our router
const router = express.Router()

// ROUTES GO HERE

// INDEX
// GET /pugs

router.get('/pugs', (req, res, next) => {
    // we will allow access to view all the pugs, by skipping 'requireToken'
    // if we wanted to make this a protect resource, we'd just need to add that middleware as the second arg to our get (like we did in create post)
    Pug.find()
        .then(pugs => {
            // pugs will be an array of mongoose documents
            // so we want to turn them in POJO (plain ol' js objects)
            // remember that map returns a new array
            return pugs.map(pug => pug.toObject())
        })
        .then(pugs => res.status(200).json({ pugs }))
        .catch(next)
})

// ROUTES ABOVE HERE

// keep at bottom of file
module.exports = router










