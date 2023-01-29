const express=require('express');
const app=express();
const cors = require('cors');
require('./db/config');
const User=require('./db/User');
const Product=require('./db/Product');
app.use(express.json());
app.use(cors());
//USER--------------------------------------------->
//SIGNUP
app.post('/register',async(req,res)=>{
    const user= new User(req.body);
    let result=await user.save();
    result =result.toObject();
    delete result.password;
    res.send(result)
})
//LOGIN
app.post('/login',async(req,res)=>{
    console.log(req.body)
    
    if(req.body.password && req.body.email){
        let user=await User.findOne(req.body).select("-password")
        
        if(user){
            return res.send(user)
        }
        else{
            return res.send({result:"no user Found"})
        }
    }
    else{
        return res.send({result:'Enter details'})
    }
   
})
//PRODUCT------------------------------------------------------>
//ADDPRODUCT
app.post('/add',async(req,res)=>{
    const product= new Product(req.body);
    const result =await product.save();
    res.send(result);
})
//PRODUCT LIST
app.get('/list',async(req,res)=>{
    const products=await Product.find();
    return res.send(products);
    if(products.length>0){
        res.send(products);
    }
    else{
        res.send({result:"No Products Found"})
    }
})
//DELETEPRODUCT
app.delete('/delete/:id',async(req,res)=>{
    const result= await Product.deleteOne({_id:req.params.id})
    res.send(result)
})
//PREFILLED DATA
app.get('/update/:id',async (req,res)=>{
    const result= await Product.findOne({_id:req.params.id})
    if(result){
        res.send(result)
    }
    else{
        res.send({result:"No Product Found"})
    }
})
//UPDATE PRODUCT
app.put('/update/:id',async (req,res)=>{
    const result = await Product.updateOne(
        {_id:req.params.id},
        {$set:req.body}
    )
    res.send(result);
})
//SEARCH PRODUCT
app.get('/search/:key',async (req,res)=>{
    const result =await Product.find({
        "$or":[
            {name:{$regex:req.params.key}},
            {company:{$regex:req.params.key}}
        ]
    })
    res.send(result)
})
app.listen(5000);