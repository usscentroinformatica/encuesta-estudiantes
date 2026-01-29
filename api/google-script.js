// api/google-script.js
export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Manejar preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzUBmWu9k8AxxAWfjpxkYRl97mrPsxxqRXWwJ7M8eFLQtgHKRyinH_rnuj9GdLVTcKd/exec";
  
  try {
    let url = GOOGLE_SCRIPT_URL;
    let options = { method: req.method };
    
    // Manejar GET (login)
    if (req.method === 'GET') {
      if (req.query.email) {
        url += `?email=${encodeURIComponent(req.query.email)}`;
      }
    }
    
    // Manejar POST (submit formulario)
    if (req.method === 'POST') {
      // Convertir JSON a FormData
      const formData = new URLSearchParams();
      for (const [key, value] of Object.entries(req.body)) {
        formData.append(key, value);
      }
      
      options.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      options.body = formData.toString();
    }
    
    console.log('Proxying to:', url);
    const response = await fetch(url, options);
    const data = await response.text();
    
    // Intentar parsear como JSON
    try {
      const jsonData = JSON.parse(data);
      return res.status(response.status).json({
        success: response.ok,
        data: jsonData
      });
    } catch {
      return res.status(response.status).json({
        success: response.ok,
        data: { text: data }
      });
    }
    
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
