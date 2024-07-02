import express from"express";
import Calories from "../model/Calories.js";
import { getCaloriesInformation } from "../util/CaloriesMethods.js";
import { notify } from "../util/notification.js";
import { getDate } from "../util/dateApi.js";

let caloriesRouter=express.Router();
caloriesRouter.post("/",async(req,res)=>{
    let { question, userId, day, history} = req.query;
      // retreive user's callories all days 
    if(userId && history=="true")
      {
        let calories=await Calories.find({userId});
        console.log(calories);
        displayCallories(calories,res)
      }
      //retreive user's callories for a day
    else if(userId && day)
      {
        let date = await getDate(day);
        console.log(date);
        console.log(typeof date);
        let calories = await Calories.find({userId,day:date});
        console.log(calories);
        displayCallories(calories,res)
      }
    else if(userId && question){     // add calories
      let caloriesInfo;
      let foodsArr=[];
      if(question!=""){
        try{
        caloriesInfo = await getCaloriesInformation(question);
        foodsArr.push(caloriesInfo.foods);
        }
        catch(error){
          return res.status(500).json({message:"somthing went wrong"});
        }
      }
      console.log(caloriesInfo);
      console.log(caloriesInfo.foods);
      let calories= await Calories.findOne({userId,day:new Date().toLocaleDateString()});
      if(!calories ){
          //new record
          let calorie = new Calories({
            calories: parseInt(caloriesInfo.calories),
            userId: parseInt(userId),
            day:new Date().toLocaleDateString(),
            foods:foodsArr
            });
            await calorie.save();
            let massage = `<contains-html><div style=border-radius:20px;background:lightgray;padding:15px>\
            <p><b>Caloreis for</b> ${caloriesInfo.foods}: </p>\
            <p><b>Description:</b> ${caloriesInfo.description}</p>\
            <p><b>Calories aproxmently = </b> ${caloriesInfo.calories}</p></div></contains-html>`;
            notify(massage)
            return res.json({ description: caloriesInfo.description });
      }
      else{
          // add summation daily calories
            calories.calories+= parseInt(caloriesInfo.calories);
            calories.foods=[...calories.foods,...foodsArr];
            await calories.save();
            let massage = `<contains-html><div style=border-radius:20px;background:lightgray;padding:15px>\
            <p><b>Caloreis for</b> ${caloriesInfo.foods}: </p>\
            <p><b>Description:</b> ${caloriesInfo.description}</p>\
            <p><b>Calories aproxmently = </b> ${caloriesInfo.calories}</p></div></contains-html>`;
            notify(massage)
            return res.json({description:caloriesInfo.description})
        }
    }
});

function displayCallories(calories,res)
{
  if(calories.length!==0){
    let markupMessage =  `<contains-html><div style=text-align:center><h3>Your Caloreis</h3></div>\
    ${calories.map((item,idx) => {
        return `<NNB[${idx+1}]>🍔 <b>Date</b>: ${item.day}</NNB[${idx+1}]></br>\
        <NerddyNewBox[${idx+1}]><div style=border-radius:20px;background:lightgray;padding:15px>\
        <h4 style=text-align:center>${item.day}</h4>\
        <table><tr>\
        <td style=max-width:750px;padding:7px><b>🍗Food Items</b></td>\
        <td style=padding:7px><b>😱Total Calories</b></td>\
        </tr>\
        <tr>\
        <td style=max-width:750px;padding:7px>${item.foods}</td>\
        <td style=padding:7px>${item.calories}</td>\
        </tr></table>\
        </div></NerddyNewBox[${idx+1}]>`
      })}</contains-html>`;
    notify (markupMessage);
    return res.json({message:"Calories are sent successfully.."});
  }
  else
  {
    let markupMessage =`<contains-html><h4>No callories recorded for this day..!!</h4></contains-html>`
    notify (markupMessage);
    return res.json({message:"No callories recorded yet !!"});
  }
}
export default caloriesRouter;