// seed.js is going to be a script that we can run from the terminal, to create a bunch of pugs at once. 

// we'll need to be careful with our seed here, and when we run it, because it will remove all the pugs first, then add the new ones. 

const mongoose = require('mongoose')
const Pug = require('./pugs')

const db = require('../../config/db')

const starterPugs = [
    { 
    name: 'Milkshake', 
    owner: "Maria London",
    image: 'https://i.imgur.com/3M2xgpk.jpg',
    color: "pink",
    age: 3
    },
    { 
    name: 'Doug', 
    owner: "Leslie Mosier",
    image: 'https://i.imgur.com/ryFDD15.jpg',
    color: "Fawn",
    age: 9
    },
    { 
    name: 'Khaleesi', 
    owner: "Stevie Militello",
    image: 'https://i.imgur.com/041F8Aw.jpg',
    color: "Fawn",
    age: 10
},

]

// first we connect to the db via mongoose
mongoose.connect(db, {
	useNewUrlParser: true,
})
    .then(() => {
        // then we remove all the pugs
        Pug.deleteMany({ owner: null })
            .then(deletedPugs => {
                console.log('deleted pugs', deletedPugs)
                // then we create using the starterPugs array
                // we'll use console logs to check if it's working or if there are errors
                Pug.create(starterPugs)
                    .then(newPugs => {
                        console.log('the new pugs', newPugs)
                        mongoose.connection.close()
                    })
                    .catch(err => {
                        console.log(err)
                        mongoose.connection.close()
                    })
            })
            .catch(error => {
                console.log(error)
                mongoose.connection.close()
            })
    })
    // then at the end, we close our connection to the db
    .catch(error => {
        console.log(error)
        mongoose.connection.close()
    })