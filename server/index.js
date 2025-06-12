const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

app.post('/run', async (req, res) => {
  const code = req.body.code;
  const id = uuidv4();
  const filePath = path.join(__dirname, `temp/${id}.html`);
  fs.writeFileSync(filePath, code);

  const url = `https://your-render-app.onrender.com/result/${id}`;
  res.json({ url });
});

app.use('/result/:id', (req, res) => {
  const id = req.params.id;
  const filePath = path.join(__dirname, `temp/${id}.html`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("Not found");
  }
});

app.listen(3000, () => console.log('Server started'));
