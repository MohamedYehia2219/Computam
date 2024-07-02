import express from "express"
import medicine from "../models/medicine.js"
import notification from "../utiles.js";
import getMedicinesInformation from "../geminiAPI.js";

let medecineRoute = express.Router()

medecineRoute.post("/",async(req,res)=>{
    let{name, userId, times, note} = req.body
    if(!times){times=[]}
    if(!note){note= 'No notes yet'}
    try
    {
        let medicineInfo =await getMedicinesInformation(name);
        console.log(medicineInfo);
        let medicineInfoArray = medicineInfo.split("\n\n");
        console.log(medicineInfoArray);
        let newMedicine = new medicine({name:name.toLowerCase(), userId, times, note, info:medicineInfoArray, history:[]});
        await newMedicine.save();
        return res.json({message:"medicine saved successfully.."});
    }catch(error)
    {
        console.log(error);
        return res.json({message:"something error.."});
    }
})

medecineRoute.get('/',async (req,res)=>{
    let{userId} = req.query;
    let userMedecines = await medicine.find({userId});
    if(userMedecines.length != 0)
    {
        let markup = dispalyMedicines(userMedecines);
        notification(markup);
        return res.json({message: "medicines retrieved ..."});
    }
    else
    {
        let markup=`<contains-html><h5>No medicines yet for this user..!</h5></contains-html>`;
        notification(markup);
        return res.json({message: "no medicines yet..."});
    }
})

medecineRoute.get('/search',async (req,res)=>{
    let {userId,name} = req.query;
    let theMedicine = await medicine.find({userId,name:name.toLowerCase()})
    if(theMedicine.length != 0)
        {
            let markup = dispalyMedicines(theMedicine);
            notification(markup);
            return res.json({message: "the medicine retrieved ..."});
        }
        else
        {
            let markup=`<contains-html><h5>No medicine with this name..!!</h5></contains-html>`;
            notification(markup);
            return res.json({message: "no medicines with this name..."});
        }
})

medecineRoute.put('/',async (req,res)=>{
    let {userId,name}= req.query;
    let exisitedMedicine = await medicine.findOne({userId,name:name.toLowerCase()})
    if(exisitedMedicine)
    {
        let times = req.body.times ?? exisitedMedicine.times;
        let note = req.body.note ?? exisitedMedicine.note;
        let history = exisitedMedicine.history;
        let info = exisitedMedicine.info;
        await medicine.findOneAndUpdate({userId,name:name.toLowerCase()},{userId,name:name.toLowerCase(),times,note,history,info})
        let markup=`<contains-html><h5>Medicine updated successfully..</h5></contains-html>`;
        notification(markup);
        return res.json({ message:"Medicine updated successfully.." });
    }
    else
    {
        let markup=`<contains-html><h5>No medicine with this name..!!</h5></contains-html>`;
        notification(markup);
        return res.json({ message:"No medicine with this name..."});
    }
})

medecineRoute.delete('/', async (req,res)=>{
    let {userId,name}= req.query;
    let exisitedMedicine = await medicine.findOne({userId,name:name.toLowerCase()})
    if(exisitedMedicine)
    {
        await medicine.findOneAndDelete({userId, name:name.toLowerCase()})
        let markup=`<contains-html><h5>Medicine deleted successfully..</h5></contains-html>`;
        notification(markup);
        return res.json({ message:"Medicine deleted successfully.." });
    }
    else
    {
        let markup=`<contains-html><h5>No medicine with this name..!!</h5></contains-html>`;
        notification(markup);
        return res.json({ message:"No medicine with this name..."});
    }
})

function dispalyMedicines(userMedecines){
    let strMarkup = `<contains-html><h4 style=text-align:center;margin-bottom:5px>My Medicines</h4>\
    ${userMedecines.map((medicine,idx)=>{return `<NNB[${idx+1}]>💊 <b>Medicine Name:</b> ${medicine.name}</NNB[${idx+1}]></br>\
    <NerddyNewBox[${idx+1}]>\
    <div style=border-radius:20px;background:lightgray;padding:15px>\
    <p><b>Medicine Name:</b> ${medicine.name}</p>\
    <p><b>Medicine times:</b> ${medicine.times}</p>\
    <p><b>Notes:</b> ${medicine.note}</p>\
    <NNB[${idx+1}][1]>⏭ <b>Medicine Log</b></NNB[${idx+1}][1]></br>\
    <NNB[${idx+1}][2]>⏭ <b>Medicine Information</b></NNB[${idx+1}][2]>\
    </div>\
    <NerddyNewBox[${idx+1}][1]>\
    <div style=border-radius:20px;background:lightgray;padding:15px>\
    ${medicine.history.map((e,i)=>{
        return `<p>▶ ${e}</p>`})}</div></NerddyNewBox[${idx+1}][1]>\
    <NerddyNewBox[${idx+1}][2]>\
    <div style=border-radius:20px;background:lightgray;padding:15px>\
    ${medicine.info.map((e,i)=>{
        return `<p>${e}</p>`})}</div></NerddyNewBox[${idx+1}][2]>\
    </NerddyNewBox[${idx+1}]>`})}</contains-html>`
    return strMarkup;
}
export default medecineRoute;