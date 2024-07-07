import express from "express";
import ShortUniqueId from "short-unique-id";
import notification from "../notification.js";
import url from "../models/url.js";
import userURLs from "../models/userURLs.js";

let urlRoute = express.Router();

urlRoute.post('/',async(req,res)=>{
    try
    {
        let {userId,fullURL}= req.body;
        let exisredURL = await url.findOne({fullURL});
        if(!exisredURL)
        {
            let shortURL = new ShortUniqueId({length:10}).rnd();
            let newURL = new url({fullURL, shortURL, clickCounter:0});
            await newURL.save();
            let markup =`<contains-html><a target="_blank" href=https://url-production.up.railway.app/urls/${shortURL}>https://url-production.up.railway.app/urls/${shortURL}</a></contains-html>`;
            notification(markup);
            res.json({message:" The URL saved successfully.."});
        }
        else
        {
            let markup =`<contains-html><a target="_blank" href=https://url-production.up.railway.app/urls/${exisredURL.shortURL}>https://url-production.up.railway.app/urls/${exisredURL.shortURL}</a></contains-html>`;
            notification(markup);
            return res.json({message:" The URL already saved .."});
        }
        // user table
        let existedRecord = await userURLs.findOne({userId,fullURL});
        if(!existedRecord)
        {
            let newRecord = new userURLs({userId,fullURL});
            await newRecord.save();
            return ;   
        }
    }
    catch(error){
        res.json({message:"some thing error !! "})
    }
})

urlRoute.get('/',async (req,res)=>{
    let{userId} = req.query;
    let userUrls = await userURLs.find({userId}) 
    if(userUrls.length != 0)
    {
        let urlsArray=[];
        let urlRecord;
        for(let urlItem of userUrls)
        {
            urlRecord = await url.findOne({fullURL: urlItem["fullURL"]});
            urlsArray.push(urlRecord);
        }
        let markup = dispalyURLs(urlsArray);
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
    {
        res.redirect(record.fullURL);
        record.clickCounter += 1 ;
        await record.save(); 
    }
})

function dispalyURLs(urlsArray)
{
    let markup=`<contains-html><div style=border-radius:15px;background:lightgray;padding:15px>\
    <h4 style=text-align:center>Your Short URLs List 🔗</h4>\
    <table><tr>\
    <td style=padding:7px><b>Short URL</b></td>\
    <td style=padding:7px><b>Visited Times</b></td>\
    </tr>\
    ${urlsArray.map((url)=>{
        return `<tr>\
                <td style=padding:7px;><a target="_blank" href=https://url-production.up.railway.app/urls/${url.shortURL}>https://url-production.up.railway.app/urls/${url.shortURL}</a></td>\
                <td style=padding:7px;text-align:center><b>${url.clickCounter}</b></td>\
                </tr>`})}</table></div></contains-html>`;
    return markup;
}
export default urlRoute;