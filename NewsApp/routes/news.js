import express from 'express'
import notification from '../utils/notification.js'
import getTopicNews from '../utils/geminiAPI.js'

const newsRouter = express.Router();
newsRouter.get('/', async (req,res)=>{
    let {topic} = req.query;
    let topicNewsURL = await getTopicNews(topic);
    console.log(topicNewsURL);
    return res.json({message: "news"});
})
export default newsRouter;