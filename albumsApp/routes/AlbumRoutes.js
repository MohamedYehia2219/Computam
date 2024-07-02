import express from"express";
import Album from "../models/Album.js";
import Image from "../models/Image.js";
import notification, { containsWords } from "../utils.js";
import { getAlbumNames } from "../GeminiURL.js";

let albumRouter=express.Router();

//create album
albumRouter.post("/",async(req,res)=>{
  try{
      let{name,userId}=req.query;
      name = name[0].toUpperCase()+name.substring(1).toLowerCase();
      let exitedalbum = await Album.findOne({name,userId});
      if(exitedalbum)
        {
          let markup=`<contains-html><h5>This album name is already existed..!</h5></contains-html>`;
          notification(markup);
          return res.json({message:"this album is already created!!"});
        }
      let relatedNamesString = await getAlbumNames(name)  
      relatedNamesString = relatedNamesString.trim();
      let relatedNames = relatedNamesString.split(', ')  
      console.log(relatedNames);
      let album=new Album({name,userId,relatedNames});
      await album.save();
      let markup=`<contains-html><h5>Album created successfully..</h5></contains-html>`;
      notification(markup);
      return res.json({message:"Album created successfully.."});  
  }catch(error)
  {
    console.log(error);
    return res.status(400).json({message:"something wrong, please check the album name again!!"});
  }  
})

//add image to album
albumRouter.post("/images",async(req,res)=>{
     let {albumName, userId } = req.query;
     let {imagesDescription}=req.body;  
     albumName = albumName[0].toUpperCase()+albumName.substring(1).toLowerCase();
     let album = await Album.findOne({name:albumName,userId});
     if(album)
      {
        let existingImages=[];
        let allUserImages = await Image.find({userId});
        for(let i=0;i<imagesDescription.length;i++)
        {
          for(let image of allUserImages)
            {
              if(containsWords(image.description,imagesDescription[i]))
                 existingImages.push(image._id)
            }
        }
        album.images=[...album.images,...existingImages];
        await album.save();
        return res.json({message:"images added successfully.."});
      }
     else
      {  
        let markup=`<contains-html><h5>This album is not found..!</h5></contains-html>`;
        notification(markup);
        res.status(400).json({message:"Album not found!!"})   
      }
}) 

//get albums with their images
//***********PROBLEM******************** 
albumRouter.get("/",async(req,res)=>{
    let {userId}=req.query;
    let albums = await Album.find({ userId }).populate("images");
    if(albums.length!=0)
      {
        let markup=retriveAlbums(albums);
        console.log(markup);
        notification(markup);
        return res.json({ message: "Albums retrived" });
      }
      else
      {
        let markup=`<contains-html><h5>No albums found..!</h5></contains-html>`;
        notification(markup);
        return res.json({ message: "No albums founded for the user!!" });
      }
})

//search for specific album
albumRouter.get("/search",async(req,res)=>{
  let result = []
  let {userId,name}=req.query;
  name = name[0].toUpperCase()+name.substring(1).toLowerCase();
  let theAlbum = await Album.findOne({name,userId}).populate("images");
  if(theAlbum)
    {
      result.push(theAlbum);
      let markup = retriveAlbums(result)
      notification(markup)  
      return res.json({ message: "Album retrived successfully.."});
    }
    else
    {
      let albumName = name.split(' ')[0]; 
      let userAlbums = await Album.find({userId}).populate("images")
      for(let i =0; i<userAlbums.length; i++)
        {
          for(let j=0; j<userAlbums[i].relatedNames.length; j++)
            {
              if(userAlbums[i].relatedNames[j] == albumName)
                  result.push(userAlbums[i]);
            }
        }
        if(result.length != 0)
          {
            let markup = retriveAlbums(result)
            notification(markup)  
            return res.json({ message: "Album retrived successfully.."});
          }
          else
          { 
            let markup=`<contains-html><h5>This album is not found..!</h5></contains-html>`;
            notification(markup);
            return res.json({ message: "Album is not found!!"});
          }
    }
})

function retriveAlbums(albums){
    let str =`<contains-html>${albums.map((album,idx)=>{return `<NNB[${idx+1}]>▶ ${album.name}</NNB[${idx+1}]></br>\
    <NerddyNewBox[${idx+1}]><nrdalbum>${album.images.map((img)=>{return " "+ img.imageUrl})}</nrdalbum></NerddyNewBox[${idx+1}]>`})}</contains-html>`;
    return str;
}
export default albumRouter;