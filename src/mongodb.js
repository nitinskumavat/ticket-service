const mongodb=require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID=mongodb.ObjectID

const connectionURL = 'mongodb://localhost:27017'
const databaseName ="ticket-service-api"

MongoClient.connect(connectionURL,{useNewUrlParser:true},{ useUnifiedTopology: true },(error,client)=>{
    if(error)
        return console.log("Unable to connect to database");
    
    const db=client.db(databaseName);
    db.dropDatabase().then(()=>{
        console.log("dropped");
    }).catch(()=>{
        console.log("Not deleted");
    })
    // db.collection("ticket").drop((err,res)=>{
    //     if(error)
    //         return ("not deleted");
    //     if(res)
    //         console.log("deletes")
    // })

})