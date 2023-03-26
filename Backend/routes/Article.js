const express=require('express');
const router=express.Router();
const Article = require("../ArticleSchema");
const auth=require("../authvalid");
const multer=require("multer");
const fs = require("fs")
require('dotenv').config({path:'../.env'})
const MIME_TYPE_MAP={
    "image/png":"png",
    "image/jpeg":"jpg",
    "image/jpg":"jpg",
}

const storage=multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null,process.env.IMAGE_PATH)
    },
    filename:(req,file,cb)=>{
        const name=file.originalname.toLowerCase().split(' ').join("-")
        const ext= MIME_TYPE_MAP[file.mimetype]
        cb(null,name+"-"+Date.now()+"."+ext)
    }
})

router.post("/create",auth,multer({storage:storage}).single("image"),(req,res)=>{
    const url=req.protocol+"://"+req.get("host")
    const article=new Article({
        title:req.body.title,
        desc:req.body.desc,
        author:req.data.name,
        creatorid:req.data.id,
        time:req.body.time,
        image:url+"/image/"+req.file.filename
    })
    article.save().then(()=>{
        res.json({messsage:"Article saved!"})
    })
})


router.patch("/update/:id",auth,multer({storage:storage}).single("image"),(req,res)=>{
    const url=req.protocol+"://"+req.get("host")
    title=req.body.title,
    desc=req.body.desc,
    author=req.data.name,
    creatorid=req.data.id,
    time=req.body.time,

    id=req.params.id

    Article.findOne({_id:id}).then(data=>{
        let path=''
        if(req.file){
            image=url+"/image/"+req.file.filename
        }
        if(data.image!==image){

            Article.updateOne({_id:id},{image:image}).then(()=>{
                path=data.image;
                fs.unlinkSync(path.replace('http://localhost','Backend'))
                res.status(201)
            })
        }
    })

    Article.updateOne({_id:id},{_id:id,title:title,desc:desc,author:author,creatorid:creatorid,time:time}).then(()=>{
        res.status(201).json({message:"Updated boi"})
    })

})

router.get("/get",(req,res)=>{
    Article.find().then(result=>{
        res.status(201).send(result)
    })
})

router.get("/get/:id",(req,res)=>{
    const id=req.params.id
    Article.findOne({_id:id}).then(result=>{
        res.status(201).send(result)
    })
})

router.get("/manage",auth,(req,res)=>{
    Article.find({creatorid:req.data.id}).then(data=>{
        res.status(201).send(data)
    })
})

router.delete("/delete/:id",auth,(req,res)=>{
    const id=req.params.id
    let path=''
    Article.findOne({_id:id}).then((data)=>{
        path=data.image;
        res.status(200)
        console.log(path)
    })
        Article.deleteOne({_id:id}).then(data=>{
        console.log("id:"+id+ " Article Deleted")
        res.status(201).json({message:"Deleted!"})
        fs.unlinkSync(path.replace('http://localhost','Backend'))
    })
})

module.exports=router
