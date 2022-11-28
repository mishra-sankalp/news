const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
require('dotenv').config();
var apiKey = process.env.KEY; //Here your API key from Mailchimp
var listID = process.env.LIST;
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get("/",function(req,res){
  res.sendFile(__dirname +"/signup.html");
})
app.post("/",function(req,res){
  const firstName= req.body.fname;
  const lastName= req.body.lname;
  const email= req.body.email;
  const data = {
    members:[
      {
        email_address: email,
        status:"subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  const jsonData= JSON.stringify(data);
  const url="https://us11.api.mailchimp.com/3.0/lists/"+listID;
  const apiKey = process.env.KEY;
  const options= {
    method:"post",
    auth:"Shailesh:"+apiKey
  }
  const request=https.request(url,options,function(response){
    if(response.statusCode===200){
      res.sendFile(__dirname+"/success.html");
    }else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data",function(data){
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
  // console.log(firstName,lastName,email);
})


app.post("/failure",function(req,res){
  res.redirect("/");
})
const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("Server is Running on port 3000");
});
