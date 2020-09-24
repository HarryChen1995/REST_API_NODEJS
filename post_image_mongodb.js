var express = require("express")
var app = express()
var mongo = require("mongodb")
var MongoClient = mongo.MongoClient
var Grid = require("gridfs-stream")
var GridFsStorage = require("multer-gridfs-storage")
var multer = require("multer")
var crypto = require("crypto")
var path = require("path")
const uri = "mongodb://localhost:27017/"

MongoClient.connect(uri, (res, client)=>{
    var db = client.db("images")
    gfs = Grid(db, mongo);
    gfs.collection("uploads")
})
var storage =  new GridFsStorage({
    url: "mongodb://localhost:27017/images",
    file: (req, file) => {
        return new Promise((resolve, reject) => {
          crypto.randomBytes(16, (err, buf) => {
            if (err) {
              return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
              filename: filename,
              bucketName: 'uploads'
            }
            resolve(fileInfo);
          })
        })
    }
})

const upload = multer({storage:storage})
app.post("/upload", upload.single("image"), (req, res)=>{
    res.json({file:req.file})
})


app.get("/files", (req, res)=>{
    gfs.files.find({}).toArray((err, files)=>{
        if (err != null) throw err
        if(!files || files.length == 0){
            return res.status(404).json({err:"no files exist"})
        }
        console.log(files)
        var readStream = gfs.createReadStream(files[0].filename)
        readStream.pipe(res)
    })
})


app.listen(1000, ()=>{"server is running"})
