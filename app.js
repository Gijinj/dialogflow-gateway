const express = require("express")
const app = express()
const path = require("path")
//var https = require('https')
//var fs = require('fs')
const dialog = require("./x.js")
const cors = require('cors');
const fulfillment = require("./fulfillment.js");

app.use(cors())

app.use(express.static("static"))
app.use(express.json());
const port = 8080

/*const options = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem')
  };*/


app.get("/", (req, res) => {
	res.send("Server is up!!")
})

app.post("/chatbot/:session", async (req, res) => {
	response = await dialog.executeQueries(req.params.session, req.body.queryInput.text.text)
	res.send(JSON.stringify(response))
})

app.get("/agent", async (req, res) => {
	response = await dialog.getAgent()
	res.send(JSON.stringify(response[0]))
})

app.post("/fulfillment/", async (req, res) => {
	res.send(fulfillment.getResponse(req.body));
})

/*https.createServer(//{
	//key: fs.readFileSync('key.pem'),
	//cert: fs.readFileSync('cert.pem')
  //}, 
  app)
  .listen(8080, function () {
	console.log('dialogflow gateway app listening on port 8080 !')
  })*/

app.listen(port, "0.0.0.0", () => console.log("Dialogflow gateway app is running on port: ", port))
