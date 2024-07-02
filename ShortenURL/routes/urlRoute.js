import express from "express";
import ShortUniqueId from "short-unique-id";
import notification from "../notification.js";
import url from "../models/url.js";

let urlRoute = express.Router();

urlRoute.post('/',async(req,res)=>{
    try
    {
        let {userId,fullURL,shortURL}= req.body;
        if(shortURL)
        {
            let record = await url.findOne({shortURL});
            if(record)
            {
                
                let markup=`<contains-html><h5>This short URL is already used!! please, select another one </h5></contains-html>`;
                notification(markup);
                return res.json({message:" This short URL is already used!.."});
            }
        }
        else{
            shortURL = new ShortUniqueId({length:10}).rnd();
        }
        let newRecord = new url({userId,fullURL,shortURL});
        await newRecord.save();
        return res.json({message:"new record saved !.."});
    }
    catch(error){
        res.json({message:"some thing error !! "})
    }
})

urlRoute.get('/',async (req,res)=>{
    let{userId} = req.query;
    let userURLs = await url.find({userId});
    if(userURLs.length != 0)
    {
        let markup = dispalyURLs(userURLs);
        notification(markup);
        return res.json({message: "Urls retrieved ..."});
    }
    else
    {
        let markup=`<contains-html><h5>No URLs yet for this user..!</h5></contains-html>`;
        notification(markup);
        return res.json({message: "no urls yet..."});
    }
})

urlRoute.get('/:shortURl',async(req,res)=>{
    let shortURL = req.params.shortURl;
    let record = await url.findOne({shortURL});
    if(record)
        res.redirect(record.fullURL);
})

urlRoute.post('/:shortURl',async(req,res)=>{
    let shortURL = req.params.shortURl;
    let record = await url.findOne({shortURL});
    if(record)
        res.redirect(record.fullURL);
})

function dispalyURLs(userURLs)
{
    let markup=`<contains-html><div style=border-radius:15px;background:lightgray;padding:10px>\
    <h4 style=text-align:center>Your Short URLs 🔗</h4>\
    ${userURLs.map((url,i)=>{
        return `<DR[${i+1}]>${url.shortURL}</DR[${i+1}]></br>\
                <DataRequest[${i+1}]><DRURL[${i+1}]>http://localhost:3000/urls/${url.shortURL}</DRURL[${i+1}]></DataRequest[${i+1}]>`})}</div></contains-html>`;
    return markup;
}
export default urlRoute;