import express from 'express';
import fs from 'fs';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(process.cwd(), 'data.json');

app.use(cors());
app.use(express.json());

// Initialize file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ nodes: [], links: [] }, null, 2));
}

// GET data
app.get('/api/data', (req, res) => {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  res.json(JSON.parse(data));
});

// POST data
app.post('/api/data', (req, res) => {
  const { nodes, links } = req.body;
  fs.writeFileSync(DATA_FILE, JSON.stringify({ nodes, links }, null, 2));
  res.json({ message: 'Saved successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Data will be stored in: ${DATA_FILE}`);
});
