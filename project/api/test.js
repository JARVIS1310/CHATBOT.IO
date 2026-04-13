export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  return res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.url,
    service: 'energy-advisor-api'
  });
}
