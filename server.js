const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const PORT = 2121
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'rap'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    .catch(e => {
        console.log('failed to connect')
        console.log(e)
        //add fallback?
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/', (request, response) => {
    db.collection('rappers').find().sort({likes: -1}).toArray()
    .then(data => {
        response.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})
app.get('/magic', (request, response) => {
    console.log('/magic')
    db.collection('magic').find().toArray()
    .then(data => {
        response.render('index.ejs', { magic: data, info: [] })
    })
    .catch(error => console.error(error))
})

// TODO: alert if deletion target doesn't exist
app.delete('/deleteMagic', (request, response) => {
    console.log('W00t')
    console.log(request.body)
    const targetID = new ObjectID(request.body.id);
    console.log(targetID)
    // ObjectId("507c35dd8fada716c89d0013")
    db.collection('magic').deleteOne({_id: targetID})
    .then(result => {
        console.log('Magic Deleted')
        response.json('Magic Deleted')
    })
    .catch(error => console.error(error))
})

app.post('/addRapper', (request, response) => {
    db.collection('rappers').insertOne({stageName: request.body.stageName,
    birthName: request.body.birthName, likes: 0})
    .then(result => {
        console.log('Rapper Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/addOneLike', (request, response) => {
    db.collection('rappers').updateOne({stageName: request.body.stageNameS, birthName: request.body.birthNameS,likes: request.body.likesS},{
        $set: {
            likes:request.body.likesS + 1
        }
    },{
        sort: {_id: -1},
        upsert: true
    })
    .then(result => {
        console.log('Added One Like')
        response.json('Like Added')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteRapper', (request, response) => {
    db.collection('rappers').deleteOne({stageName: request.body.stageNameS})
    .then(result => {
        console.log('Rapper Deleted')
        response.json('Rapper Deleted')
    })
    .catch(error => console.error(error))

})

// app.delete('/deleteMagic', (request, response) => {
//     console.log(request)
//     // ObjectId("507c35dd8fada716c89d0013")
//     db.collection('magic').deleteOne({number: "number"})
//     .then(result => {
//         console.log('Magic Deleted')
//         response.json('Magic Deleted')

//         // response.redirect('/magic')
//     })
//     .catch(error => console.error(error))
// })

// TODO: get initial position from request
app.post('/initMagicValue', (request, response) => {
    db.collection('magic')
    .insertOne({
        value: 0,
        object3D: {
            position: [0, 0, 0],
            rotation: [0, 0, 0]
        }
    })
    .then(result => {
        console.log("Magic Position/Rotation reset!");
        // TODO: UPDATE FRONTEND
        response.redirect('/magic')
        // response.json('what does response.json do?')// frontened showed (navigated to?) that text
    })
    .catch(error => console.error(error))
})
app.put('/updateMagicValue', (request, response) => {
    ObjectID
    const new_x = 2;
    db.collection('magic').updateOne(
        {_id: 'number', value: 0}

    )
    .then(result => {
        response.redirect('/magic')
    })
    .catch(error => console.error(error))
})

app.put('/addOneLike', (request, response) => {
    db.collection('rappers').updateOne({stageName: request.body.stageNameS, birthName: request.body.birthNameS,likes: request.body.likesS},{
        $set: {
            likes:request.body.likesS + 1
        }
    },{
        sort: {_id: -1},
        upsert: true
    })
    .then(result => {
        console.log('Added One Like')
        response.json('Like Added')
    })
    .catch(error => console.error(error))

})

app.put('/increaseMagicNumber', (request, response) => {
    db.collection('magic').updateOne({id: 'number'}, {
        $set: {
            value: 1
        }
    })
})


app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})