import express from"express";
import axios from "axios";

let port=3000;
const app=express()




app.post("/translate",async(req,res)=>{
let {sentence,language}=req.query
let translataionResult=await translate(sentence,language)
 let response = await fetch("https://www.computam.com/beta/notification/v1/", {
   method: "POST",
   body: JSON.stringify({
     appid: "gfdj6rkjuykfgyhtrfjuhry6jh",
     accesskey: "fgh55yy676i68ytjuyju76jjhlu",
     requestid: 55,
     design: "output",
     recipient: 29,
     title: "testing",
     tagline: "api testing",
     notificationbody: `<contains-html><p> trnaslated to <span style=font-weight:bold;>${language[0].toUpperCase()+language.substring(1)}</span></p></b><h3 style=padding:5px;width:50%;min-height:50px;border:3px;border-color:black;border-style:solid>${translataionResult}</h3></contains-html>`,
   }),
   headers: { "Ocp-Apim-Subscription-Key": "whatever" },
 });


res.json({message:"translated sucsesfully"})
})




async function translate(sentence,language){
let languageVar = (language[0] + language[1]).toLowerCase();
console.log(languageVar);
const options = {
  method: 'POST',
  url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
  params: {
    'to[0]':languageVar,              // translate into english for example
    'api-version': '3.0',
    profanityAction: 'NoAction',
    textType: 'plain'
  },
  headers: {
    'content-type': 'application/json',
    'X-RapidAPI-Key': 'db128e04admshd583eb94cd19806p1b07b7jsn19caa4617c42',
    'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
  },
  data: [
    {
      Text: sentence
}]
}
try {
	const response = await axios.request(options);
	let translataion=response.data;
    console.log(response.data)
    console.log(translataion[0].translations);
    return translataion[0].translations[0].text
} catch (error) {
	console.error(error);
}
}




app.listen(port,(req,res)=>{
    console.log("server started on port: "+ port);
})




