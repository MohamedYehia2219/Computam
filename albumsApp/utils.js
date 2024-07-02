async function notification(message){
    let response = await fetch(
        "https://www.computam.com/beta/notification/v1/",
        {
          method: "POST",
          body: JSON.stringify({
            appid: "gfdj6rkjuykfgyhtrfjuhry6jh",
            accesskey: "fgh55yy676i68ytjuyju76jjhlu",
            requestid: 55,
            design: "output",
            recipient: 29,
            title: "testing",
            tagline: "api testing",
            notificationbody:message 
          }),
        }
    );
}

function containsWords(actualDesc, userDesc) {
  // Split the stored description into words
  let actualDescWords= actualDesc.split(' ');
  let userDescWords= userDesc.split(' ');
  for(let i=0; i<actualDescWords.length; i++)
    {
      for(let j=0; j<userDescWords.length; j++)
        {
            if(actualDescWords[i].toLowerCase()==userDescWords[j].toLowerCase())
              return true;
        }
    }
}
export default notification;
export {containsWords}

