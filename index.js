const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const COUNTER_FILE = path.join(__dirname, 'counter.json');

app.use(express.static('static'))

app.listen(3000);

app.use(express.static(path.join(__dirname, 'static')));


function loadCounters() {
  try {
    if (fs.existsSync(COUNTER_FILE)) {
      const data = fs.readFileSync(COUNTER_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading counters file:', err);
  }
  return { '/': 0, '/about': 0 }; 
}


function saveCounters(counters) {
  try {
    fs.writeFileSync(COUNTER_FILE, JSON.stringify(counters, null, 2));
  } catch (err) {
    console.error('Error writing counters file:', err);
  }
}


let counters = loadCounters();


function injectCounter(filePath, counterValue) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    return content.replace('{{views}}', counterValue); 
  } catch (err) {
    console.error('Error reading HTML file:', err);
    return '<h1>Error loading page</h1>';
  }
}


app.get('/', (req, res) => {
  counters['/'] += 1; 
  saveCounters(counters); 
  const htmlContent = injectCounter(path.join(__dirname, 'static', 'index.html'), counters['/']);
  res.send(htmlContent);
});


app.get('/about', (req, res) => {
  counters['/about'] += 1; 
  saveCounters(counters); 
  const htmlContent = injectCounter(path.join(__dirname, 'static', 'about.html'), counters['/about']);
  res.send(htmlContent);
});


app.use(express.static(path.join(__dirname, 'static')));


