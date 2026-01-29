// netlify/functions/google-script-proxy.js

exports.handler = async function(event, context) {
  // URL de tu Google Apps Script
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyAGPtXocIv6tmex8K_x484P0FzKnwNyacN9PA-6-2kOsh9wagYXdDD4kYQ1t9z_Alz/exec";
  
  // Configurar headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };
  
  // Manejar solicitud preflight (OPTIONS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }
  
  try {
    let url = GOOGLE_SCRIPT_URL;
    let options = {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    
    // Manejar GET requests (para login)
    if (event.httpMethod === 'GET') {
      const queryParams = new URLSearchParams(event.queryStringParameters || {});
      if (queryParams.toString()) {
        url += '?' + queryParams.toString();
      }
    }
    
    // Manejar POST requests (para enviar formulario)
    if (event.httpMethod === 'POST') {
      // Parsear el body si viene como JSON string
      let body;
      if (event.body) {
        try {
          const parsedBody = JSON.parse(event.body);
          // Convertir de JSON a URLSearchParams
          const formData = new URLSearchParams();
          Object.keys(parsedBody).forEach(key => {
            formData.append(key, parsedBody[key]);
          });
          body = formData.toString();
        } catch (e) {
          // Si ya viene como form-urlencoded, usarlo directamente
          body = event.body;
        }
      }
      options.body = body;
    }
    
    console.log('Proxying to:', url);
    console.log('Options:', { method: options.method, hasBody: !!options.body });
    
    // Hacer la solicitud al Google Script
    const response = await fetch(url, options);
    
    // Intentar leer como texto primero
    const responseText = await response.text();
    
    let responseData;
    try {
      // Intentar parsear como JSON
      responseData = JSON.parse(responseText);
    } catch (e) {
      // Si no es JSON válido, devolver como texto
      responseData = { text: responseText };
    }
    
    // Devolver respuesta exitosa
    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify({
        success: response.ok,
        data: responseData,
        status: response.status,
        statusText: response.statusText
      }),
    };
    
  } catch (error) {
    console.error('Proxy error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        message: 'Error en el servidor proxy'
      }),
    };
  }
};
