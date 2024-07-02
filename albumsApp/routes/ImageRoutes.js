import express from "express";
import Image from "../models/Image.js";
import notification from "../utils.js";
import { run } from "../GeminiURL.js";
import {containsWords} from '../utils.js'
import Album from "../models/Album.js";

let imageRouter = express.Router();

//store new image
imageRouter.post("/",async(req,res)=>{
  try{
      let{imageUrl,name,userId}=req.body;
      let existedUser= await Image.findOne({userId})
      //first time --> create default album
      if(!existedUser)
        {
          let albumName = 'My album';
          let relatedNames = ['Default','Photos','Gallery','Images']
          let album = new Album({name:albumName,userId,relatedNames});
          await album.save();
        }
      //Gemini API
      let description = await run(imageUrl);
      console.log(description);
      if(!name){name='image'}
      name=name.toLowerCase();
      let newImage=new Image({name,description:description.trim(),imageUrl,userId});
      await newImage.save();
      return res.json({message:"image saved successfully.."});
  }catch(error)
  {
    console.log(error);
    return res.status(400).json({message:"something wrong...!!"});
  }
})

//get all images
imageRouter.get("/",async(req,res)=>{
    let {userId}=req.query;
    let userImages=await Image.find({userId});
    if(userImages.length!=0)
      {
        let markup=createImages(userImages);
        notification(markup);
        return res.json({ message: "images retrived" });
      }
    else
    {
      let markup=`<contains-html><h5>No images stored yet..!</h5></contains-html>`;
      notification(markup);
      return res.json({ message: "no images found for this user!" });
    }
})

//search by name or description
imageRouter.get("/search",async(req,res)=>{
  try{
      let {name,description,userId} =req.query;
      let markup;
      if(name)
        {
          let result = await Image.find({name:name.toLowerCase(),userId});
          if(result.length == 0)
            {
              markup=`<contains-html><h5>No Images found with this name..!</h5></contains-html>`;
              notification(markup);
              return res.status(404).json({message:"images with this name not found.."}); 
            }
          markup=createImages(result);
          notification(markup);
          return  res.json({message:"images retrieved.."}); 
        }
      if(description)
        {
          let allUserImages = await Image.find({userId});
          if(allUserImages.length!=0)
            {
              let result = []
              for(let image of allUserImages)
                {
                  if(containsWords(image.description,description))
                      result.push(image)
                }
              if(result.length == 0)
                {
                  markup=`<contains-html><h5>No Images found that match this description..!</h5></contains-html>`;
                  notification(markup);
                  return res.status(404).json({message:"No Images found that match this description.."}); 
                }
              markup=createImages(result);
              notification(markup);
              return  res.json({message:"images retrieved.."}); 
            }
          else
          {
            let markup=`<contains-html><h5>No images stored yet for this user..!</h5></contains-html>`;
            notification(markup);
            res.json({message:"No image stored for this user..!!"});   
          }        
        }
        else{ return res.json({message:"Invalid Query Params!!"})}
    }catch(error){console.log(error);}
})

function createImages(userImages){
    let strMarkup = `<contains-html><h5 style=text-align:center;margin-bottom:5px>My Images</h5><nrdalbum>${userImages.map((img)=>{return " "+ img.imageUrl})}</nrdalbum></contains-html>`;
    return strMarkup;
}
export default imageRouter;