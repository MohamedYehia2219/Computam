import express from "express";
import notification from "../utils/notification.js";
import getTopicNews from "../utils/NewsAPI.js";
import getRightName from "../utils/gemini api.js";

const newsRouter = express.Router();
newsRouter.get("/", async (req, res) => {
  let { topic } = req.query;
  let rightTopipcName = await getRightName(topic);
  console.log(rightTopipcName);
  let News = await getTopicNews(rightTopipcName);
  if (News.length != 0) {
    let markup = dispalyNews(News);
    notification(markup);
  }
  else 
  { 
    let markup = `<contains-html><h3>Invalid Topic!!..</h3></contains-html>`;
    notification(markup);
  }
  return res.json({ message: "news", articles: News });
});

function dispalyNews(ArrayNews) {
  let markup = `<contains-html>\
    ${ArrayNews.map((n) => {
      return `<div style=background-color:lightgray;display:flex;flex-direction:row;border-radius:15px>\
        <img src=${n.urlToImage} width=300px height=250px/>\
      <div style=display:flex;flex-direction:column;padding:25px;margin-left:10px>\
        <h3>${n.title}</h3>\
        <p style=margin-bottom:10px;color:#337fa5>${n.publishedAt}</p>\
        <h4>${n.description}</h4>\
        <a href=${n.url} target=_blank">Get More..</a>\
      </div>\
    </div>`
    })}</contains-html>`;

  return markup;
}
export default newsRouter;
