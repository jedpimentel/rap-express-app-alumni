const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const PORT = 2121
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'rap'

console.log('attempting db connection', process.env.DB_STRING)
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
    response.render('index.ejs')
})
app.get('/rappers', (request, response) => {
    db.collection('rappers').find().sort({likes: -1}).toArray()
    .then(data => {
        response.render('rappers.ejs', { info: data })
    })
    .catch(error => console.error(error))
})

app.post('/addRapper', (request, response) => {
    db.collection('rappers').insertOne({stageName: request.body.stageName,
    birthName: request.body.birthName, likes: 0})
    .then(result => {
        console.log('Rapper Added')
        response.redirect('back')
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


app.get('/magic', (request, response) => {
    console.log('/magic')
    db.collection('magic').find().toArray()
    .then(data => {
        response.render('magic.ejs', { magic: data, info: [] })
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

// TODO: get initial position from request
app.post('/initMagicValue', (request, response) => {
    db.collection('magic')
    .insertOne({
        value: 0,
        // object3D: {
        //     position: [0, 0, 0],
        //     rotation: [0, 0, 0]
        // }
        // seriously, strings like this aren't optimal
        position: "0 0 0",
        rotation: "0 0 0",
    })
    .then(result => {
        // TODO: UPDATE FRONTEND AS A SINGLE PAGE APP
        response.redirect('/magic')
    })
    .catch(error => console.error(error))
})
app.put('/updateMagic', (request, response) => {
    const id = request.body.id;
    console.log(id);
    console.log(request.body)
    if (!id) throw "/updateMagic needs an ID";
    const targetID = new ObjectID(request.body.id);
    // ???: how much better is it to save position+rotation as an array?
    // maybe not the best idea to have the IDs viewable in the inspector 
    // const object3D = request.body.object3D;
    // const wxyz = request.body.wxyz;
    // const new_x = 2;
    db.collection('magic').updateOne(
        {_id: targetID},
        {
            $set: {
                // wxyz: wxyz
                position: request.body.position,
                rotation: request.body.rotation,
                wut: 'wut',
            }
        }
    )
    .then(result => {
        // Don't redirect
        console.log('update', result)
        // response.redirect('/magic')
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