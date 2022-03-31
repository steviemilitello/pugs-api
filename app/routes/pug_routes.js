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

// SHOW
//GET /pugs/6244ef96004ab9a82fa36063

router.get('/pugs/:id', (req, res, next) => {
    // we get the id from req.params.id -> :id
    Pug.findById(req.params.id)
        .then(handle404)
        // if its successful, respond with an object as json
       .then(pug => res.status(200).json({ pug: pug.toObject() }))
        // otherwise pass to error handler
        .catch(next)

})

// CREATE
// POST  /pugs

router.post('/pugs', requireToken, (req, res, next) => {
    // we brought in requireToken, so we can have access to req.user
    req.body.pug.owner = req.user.id

    Pug.create(req.body.pug)
        .then(pug => {
            // send a successful response like this
            res.status(201).json({ pug: pug.toObject() })
        })
        // if an error occurs, pass it to the error handler
        .catch(next)
})

// UPDATE
// PATCH /pugs/6244ef96004ab9a82fa36063

router.patch('/pugs/:id', requireToken, removeBlanks, (req, res, next) => {
    // if the client attempts to change the owner of the pug, we can disallow that from the get go 
    delete req.body.owner
    // then we find the pug by the id 
    Pug.findById(req.params.id)
    // handle our 404 
        .then(handle404)
    // requireOwnership and update the pug 
        .then(pug => {
            requireOwnership(req, pug)

            return pug.updateOne(req.body.pug)
        })
    // send a 204 no content if successful 
        .then(() => res.sendStatus(204))
    // pass to errorHandler if not successful
        .catch(next)
})

router.delete('/pugs/:id', requireToken, (req, res, next) => {
    // then find the pug by id
    Pug.findById(req.params.id)
    //first handle the 404 if any
        .then(handle404)
    // use requireOwnership middleware to make sure the right person is making this request
        .then(pug => {
            // requireOwnership needs two arguments
            // these are the req, and the document itself
            requireOwnership(req, pug)
            // delete if the middleware doesnt throw an error
            pug.deleteOne()
        })
        // send back a 204 no content status
        .then(() => res.sendStatus(204))
        // if error occurs, pass to the handler
        .catch(next)
})

// ROUTES ABOVE HERE

// keep at bottom of file
module.exports = router










