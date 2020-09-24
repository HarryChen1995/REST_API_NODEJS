var express = require("express")
var multer = require("multer")
var app = express()

const storage = multer.diskStorage({

    destination:function (req, file, cb){
        cb(null, "./")
    },


    filename: function(req, file, cb){
        cb(null, file.originalname)
    }

})

var upload = multer({
    storage:storage,
})

app.post("/upload", upload.single("file"), (req, res)=>{
    res.send("file uploaded")
})


app.listen(1000, ()=>{
    console.log("server is runing")
})
