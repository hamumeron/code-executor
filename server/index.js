const express = require('express');
const { NodeVM } = require('vm2');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public'))); // ../publicを配信

app.post('/run', (req, res) => {
  const code = req.body.code;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  const vm = new NodeVM({
    console: 'redirect',
    timeout: 3000,
    sandbox: {}
  });
  const logs = [];
  vm.on('console.log', msg => logs.push(msg));

  try {
    const result = vm.run(code);
    res.json({ result, logs });
  } catch (err) {
    res.json({ error: err.message, logs });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
