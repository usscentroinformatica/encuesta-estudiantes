// netlify/functions/google-script-proxy.js

exports.handler = async function(event, context) {
  // URL de tu Google Apps Script
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzUBmWu9k8AxxAWfjpxkYRl97mrPsxxqRXWwJ7M8eFLQtgHKRyinH_rnuj9GdLVTcKd/exec";
  
  // Configurar headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    console.log('Event body:', event.body);
    console.log('HTTP Method:', event.httpMethod);
    
    let url = GOOGLE_SCRIPT_URL;
    let options = {
      method: event.httpMethod,
      redirect: 'follow', // IMPORTANTE: Seguir redirecciones
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
      let bodyData;
      
      if (event.body) {
        try {
          const parsedBody = JSON.parse(event.body);
          console.log('Parsed body:', parsedBody);
          
          // Si es una acción de login, usar GET con parámetros
          if (parsedBody.action === 'login' && parsedBody.email) {
            url += '?email=' + encodeURIComponent(parsedBody.email);
            options.method = 'GET';
          } else {
            // Para submit, usar POST con form data
            const formData = new URLSearchParams();
            Object.keys(parsedBody).forEach(key => {
              formData.append(key, parsedBody[key]);
            });
            bodyData = formData.toString();
            options.headers = {
              'Content-Type': 'application/x-www-form-urlencoded',
            };
          }
        } catch (e) {
          console.log('Error parsing body:', e);
          // Si ya viene como form-urlencoded, usarlo directamente
          bodyData = event.body;
          options.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
          };
        }
      }
      
      if (bodyData) {
        options.body = bodyData;
      }
    }
    
    console.log('Proxying to:', url);
    console.log('Options:', options);
    
    // Hacer la solicitud al Google Script
    const response = await fetch(url, options);
    console.log('Response status:', response.status);
    
    // Intentar leer como texto primero
    const responseText = await response.text();
    console.log('Response text:', responseText);
    
    let responseData;
    try {
      // Intentar parsear como JSON
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.log('Not valid JSON, returning as text');
      // Si no es JSON válido, devolver como texto
      responseData = { text: responseText };
    }
    
    console.log('Response data:', responseData);
    
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
