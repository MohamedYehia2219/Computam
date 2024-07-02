import express from "express"
import notification from "../utiles.js";
import medicalLog from "../models/medicalLog.js";
import medicine from "../models/medicine.js";

let medicalLogRoute = express.Router()

medicalLogRoute.post('/', async(req,res)=>{
    let {userId, date, medicines} = req.body;
    if(!date){date = new Date().toLocaleDateString()} 
    // get medicines IDs from names
    let existedMedicines=[];
    let allUserMedicines = await medicine.find({userId});
    for(let i=0;i<medicines.length;i++)
    {
      for(let medicin of allUserMedicines)
        {
          if(medicin.name==medicines[i].toLowerCase())
            {
              existedMedicines.push(medicin._id);
              medicin.history = [...medicin.history, date];
              await medicin.save();
            }
        }
    }

    let existedRecord = await medicalLog.findOne({userId,date});
    if(existedRecord)
    {
        existedRecord.medicines = [...existedRecord.medicines, ...existedMedicines]
        await existedRecord.save();
        return res.json({message:"medicines added successfully.."});
    } 
    else
    {
        let newRecord = new medicalLog({userId,date,medicines:existedMedicines});
        await newRecord.save();
        return res.json({message:"medicines saved successfully.."});
    }
})

medicalLogRoute.get('/', async(req,res)=>{
    let{userId} = req.query;
    let history = await medicalLog.find({ userId }).populate("medicines");
    if(history.length!=0)
      {
        let markup=retriveHistory(history);
        notification(markup);
        return res.json({ message: "history retrived" });
      }
      else
      {
        let markup=`<contains-html><h5>No history found..!</h5></contains-html>`;
        notification(markup);
        return res.json({ message: "No history founded for the user!!" });
      }
})

medicalLogRoute.get('/search', async(req,res)=>{
    let{userId,date} = req.query;
    let theDay = await medicalLog.find({ userId,date }).populate("medicines");
    if(theDay.length!=0)
      {
        let markup=retriveHistory(theDay);
        notification(markup);
        return res.json({ message: "The Day retrived"});
      }
      else
      {
        let markup=`<contains-html><h5>No history found for this day..!</h5></contains-html>`;
        notification(markup);
        return res.json({ message: "No Day founded for the user!!" });
      }
})

function retriveHistory(history){
    let markup=`<contains-html><div style=text-align:center><h4>Your History 💊</h4></div>\
    ${history.map((item,idx) => {
        return `<NNB[${idx+1}]>▶ <b>Date</b>: ${item.date}</NNB[${idx+1}]></br>\
        <NerddyNewBox[${idx+1}]><div style=border-radius:20px;background:lightgray;padding:15px><h4 style=text-align:center>${item.date}</h4>\
        <table><tr>\
        <td style=max-width:200px;padding:5px><b>💊Medicine Name</b></td>\
        <td style=max-width:400px;padding:5px><b>⌚Medicine Times</b></td>\
        <td style=padding:5px><b>📝Medicine Notes</b></td></tr>\
        ${item.medicines.map((medicin,i)=>{
          return `<tr>\
          <td style=max-width:200px;padding:5px>${medicin.name}</td>\
          <td style=max-width:400px;padding:5px>${medicin.times}</td>\
          <td style=padding:5px>${medicin.note}</td></tr>`})}</table></div></NerddyNewBox[${idx+1}]>`
      })}</contains-html>`;
    return markup;
}
export default medicalLogRoute