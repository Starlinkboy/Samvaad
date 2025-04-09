const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: "AIzaSyDxEaNhLn01ErwjamPLbT46f4sjeVEIzJw" });

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(sanitizeInput);
app.get('/', async (req, res) => {
      res.render('user')  
  });

app.post('/submitext', async (req, res) => {
  
    const name = req.body;
    let e = name.name1
    main(name).then((result) => {
    res.render('sent', {result, e})
   
    })
  });
  app.post('/check', async (req, res) => {
  
    const name = req.body;
    let e = name.che
    let f = name.dec
    recheck(f,e).then((result) => {
    res.render('check', {result, f})
    })
  });



  async function main(b) {
    console.log(b.name1)
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
  You are a fact-checking system. For each piece of news, respond with "Real" or "Fake". Provide no explanation or additional information. Here are the news pieces: ${b.name1}`,
    });
    
  
    return response.text.trim(); 
  }
  async function recheck(a,b) {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
  You are a fact-checking system. You have already checked a piece of news and given the verdict as ${a}. Now, explain why you think it is ${a}. Here is the news piece: ${b}`,
    });
    
  
    return response.text.trim(); 
  }
  
function sanitizeInput(req, res, next) {
  const { body } = req;
  for (const key in body) {
    if (typeof body[key] === 'string') {
      body[key] = body[key].trim();
    }
  }
  next();
}

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
