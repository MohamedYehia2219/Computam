import axios from "axios";

async function getTopicNews(topic) {
  let result;
  await axios
    .get(
      `https://newsapi.org/v2/everything?q=${topic}&apiKey=312a9746c2b549bea1f6a9a2424db5f7`
    )
    .then((res) => {
      //   console.log(res.data.articles);
      result = res.data.articles;
      result = result.filter((n)=>n.urlToImage != null)
      result = result.splice(0,5);
    })
    .catch((e) => e);
  return result;
}

export default getTopicNews;
