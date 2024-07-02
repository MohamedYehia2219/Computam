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
export default notification;
