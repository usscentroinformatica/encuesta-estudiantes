// src/pages/Login.tsx
import { useState } from 'react'
import logoUss from '../assets/uss.png'

// USA LA NUEVA URL que creaste
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycby_N8sxngW1YlERHImY12IHdRJA-59NOnPpJLAqNf7e8jPI2KLtnbUhwvJsU-Lgafk/exec"

export default function Login() {
  const [nombreUsuario, setNombreUsuario] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const emailCompleto = `${nombreUsuario}@uss.edu.pe`.toLowerCase()

  const ingresar = async () => {
    if (!nombreUsuario.trim()) {
      setError('Ingresa tu usuario')
      return
    }

    setLoading(true)
    setError('')

    try {
      // SOLUCIÓN: Múltiples intentos con diferentes proxies y mejor manejo
      let data = null
      let lastError = null
      
      // Lista de proxies para intentar
      const proxyAttempts = [
        // Opción 1: Directo (puede funcionar con la nueva URL)
        async () => {
          console.log('Intentando conexión directa...')
          const res = await fetch(`${WEB_APP_URL}?email=${encodeURIComponent(emailCompleto)}`)
          return await res.json()
        },
        
        // Opción 2: corsproxy.io (tu actual)
        async () => {
          console.log('Intentando con corsproxy.io...')
          const url = `https://corsproxy.io/?${encodeURIComponent(
            WEB_APP_URL + '?email=' + encodeURIComponent(emailCompleto)
          )}`
          const res = await fetch(url)
          return await res.json()
        },
        
        // Opción 3: allorigins.win (alternativa confiable)
        async () => {
          console.log('Intentando con allorigins.win...')
          const url = `https://api.allorigins.win/get?url=${encodeURIComponent(
            `${WEB_APP_URL}?email=${encodeURIComponent(emailCompleto)}`
          )}`
          const res = await fetch(url)
          const result = await res.json()
          return JSON.parse(result.contents)
        },
        
        // Opción 4: cors-anywhere (heroku)
        async () => {
          console.log('Intentando con cors-anywhere...')
          const url = `https://cors-anywhere.herokuapp.com/${WEB_APP_URL}?email=${encodeURIComponent(emailCompleto)}`
          const res = await fetch(url)
          return await res.json()
        },
        
        // Opción 5: codetabs CORS proxy
        async () => {
          console.log('Intentando con codetabs...')
          const url = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(
            `${WEB_APP_URL}?email=${encodeURIComponent(emailCompleto)}`
          )}`
          const res = await fetch(url)
          return await res.json()
        }
      ]

      // Intentar cada método hasta que uno funcione
      for (let i = 0; i < proxyAttempts.length; i++) {
        try {
          data = await proxyAttempts[i]()
          console.log(`Proxy ${i + 1} funcionó:`, data)
          
          // Verificar que la respuesta es válida
          if (data && (data.cursos !== undefined || data.error !== undefined)) {
            break // Salir del loop si tenemos una respuesta válida
          } else {
            throw new Error('Respuesta inválida del proxy')
          }
        } catch (err: any) {
          console.log(`Proxy ${i + 1} falló:`, err.message)
          lastError = err
          // Continuar con el siguiente proxy
        }
      }

      // Si todos fallaron, mostrar error específico
      if (!data) {
        throw new Error(
          lastError?.message || 
          'Todos los métodos de conexión fallaron. ' +
          'Verifica tu internet o intenta desde un navegador diferente.'
        )
      }

      console.log('RESPUESTA FINAL API:', data)

      // Procesar respuesta
      if (data.error) {
        setError(data.error)
      } else if (data.cursos && Array.isArray(data.cursos) && data.cursos.length > 0) {
        // Validar que los cursos sean válidos (no "Sin cursos asignados")
        const cursosValidos = data.cursos.filter((curso: any) => 
          curso.curso && curso.curso !== "Sin cursos asignados"
        )
        
        if (cursosValidos.length > 0) {
          localStorage.setItem(
            'eval_data',
            JSON.stringify({
              email: emailCompleto,
              cursos: cursosValidos
            })
          )
          window.location.href = '/formulario'
        } else {
          setError('Usuario no tiene cursos asignados para evaluar')
        }
      } else if (data.cursos && Array.isArray(data.cursos) && data.cursos.length === 0) {
        setError('No tienes cursos asignados para evaluar')
      } else {
        setError('Respuesta inesperada del servidor')
      }

    } catch (err: any) {
      console.error('Error completo:', err)
      
      // Mensajes de error más específicos
      if (err.message.includes('Failed to fetch')) {
        setError('No se pudo conectar al servidor. Verifica tu conexión a internet.')
      } else if (err.message.includes('Todos los métodos')) {
        setError('Error de conexión. Intenta desde otro navegador o dispositivo.')
      } else if (err.message.includes('JSON')) {
        setError('Error en la respuesta del servidor. Intenta nuevamente.')
      } else {
        setError('Error: ' + err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // Resto del código JSX se mantiene IGUAL...
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5', 
      fontFamily: 'Roboto, Arial, sans-serif', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      {/* Header Principal con Logo USS */}
      <header style={{ 
        backgroundColor: '#ffffff',
        borderBottom: '6px solid #63ed12',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          maxWidth: '680px', 
          margin: '0 auto',
          padding: '30px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <img 
            src={logoUss} 
            alt="Universidad Señor de Sipán" 
            style={{ 
              width: '200px',
              height: 'auto',
              objectFit: 'contain'
            }} 
          />
        </div>
      </header>

      {/* Contenido Principal */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '40px 20px' 
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '680px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 1px 6px rgba(32,33,36,0.28)', 
          overflow: 'hidden' 
        }}>
          {/* Banner del Formulario */}
          <div style={{ 
            backgroundColor: '#5a2290',
            color: 'white', 
            padding: '32px 48px', 
            textAlign: 'center' 
          }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: '28px', 
              fontWeight: '400' 
            }}>
              ENCUESTA DE SATISFACCIÓN DOCENTE
            </h2>
            <div style={{ 
              marginTop: '12px', 
              fontSize: '16px',
              fontWeight: '500'
            }}>
              2026 ENERO
            </div>
            <div style={{ 
              marginTop: '8px', 
              fontSize: '14px', 
              opacity: 0.9 
            }}>
              Tu participación es anónima y confidencial.
            </div>
          </div>

          {/* Formulario de Login */}
          <div style={{ padding: '32px 48px' }}>
            <div style={{ 
              border: '1px solid #dadce0', 
              borderRadius: '8px', 
              padding: '24px', 
              marginBottom: '32px',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ 
                fontSize: '14px', 
                color: '#202124', 
                marginBottom: '12px', 
                fontWeight: '500' 
              }}>
                Correo institucional <span style={{ color: '#d93025' }}>*</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                border: '2px solid #dadce0', 
                borderRadius: '4px', 
                padding: '0 14px', 
                backgroundColor: '#fff', 
                height: '56px',
                transition: 'border-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#63ed12'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#dadce0'}
              >
                <input
                  type="text"
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value.toLowerCase().trim())}
                  onKeyDown={(e) => e.key === 'Enter' && ingresar()}
                  placeholder="tuusuario"
                  disabled={loading}
                  style={{ 
                    flex: 1, 
                    border: 'none', 
                    outline: 'none', 
                    fontSize: '16px',
                    backgroundColor: 'transparent'
                  }}
                />
                <span style={{ 
                  color: '#5f6368', 
                  fontSize: '16px', 
                  fontWeight: '500' 
                }}>
                  @uss.edu.pe
                </span>
              </div>
              <div style={{
                fontSize: '12px',
                color: '#5f6368',
                marginTop: '8px'
              }}>
                Ingresa solo tu nombre de usuario sin el @uss.edu.pe
              </div>
            </div>

            {/* Botones */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ fontSize: '12px', color: '#5f6368' }}>
                {loading && 'Conectando... (esto puede tomar unos segundos)'}
              </div>
              <button
                onClick={ingresar}
                disabled={loading || !nombreUsuario}
                style={{
                  backgroundColor: loading || !nombreUsuario ? '#f1f3f4' : '#5a2290',
                  color: loading || !nombreUsuario ? '#9aa0a6' : 'white',
                  border: 'none',
                  padding: '12px 32px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: loading || !nombreUsuario ? 'not-allowed' : 'pointer',
                  boxShadow: loading || !nombreUsuario ? 'none' : '0 2px 6px rgba(90, 34, 144, 0.4)',
                  transition: 'all 0.3s ease',
                  minWidth: '120px',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!loading && nombreUsuario) {
                    e.currentTarget.style.backgroundColor = '#63ed12'
                    e.currentTarget.style.color = '#000'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(99, 237, 18, 0.4)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && nombreUsuario) {
                    e.currentTarget.style.backgroundColor = '#5a2290'
                    e.currentTarget.style.color = 'white'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(90, 34, 144, 0.4)'
                  }
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginRight: '8px'
                    }} />
                    Conectando...
                  </>
                ) : 'Siguiente'}
              </button>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div style={{ 
                marginTop: '24px', 
                padding: '16px', 
                backgroundColor: '#fce8e6', 
                color: '#c5221f', 
                borderRadius: '8px', 
                border: '1px solid #f28b82',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  backgroundColor: '#c5221f',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  !
                </div>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                    Error de conexión
                  </div>
                  <div style={{ fontSize: '14px' }}>{error}</div>
                </div>
              </div>
            )}

            {/* Información adicional para Netlify */}
            {!error && !loading && (
              <div style={{ 
                marginTop: '24px',
                padding: '12px',
                backgroundColor: '#e3f2fd',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#1565c0',
                borderLeft: '4px solid #2196f3'
              }}>
                
              </div>
            )}
          </div>

          {/* Footer del Formulario */}
          <footer style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '24px 48px', 
            fontSize: '12px', 
            color: '#5f6368', 
            borderTop: '1px solid #dadce0', 
            textAlign: 'center',
            lineHeight: '1.6'
          }}>
            Nunca envíes contraseñas a través de Formularios de Google.<br />
            Este formulario se creó en el Centro de Informática de la Universidad Señor de Sipán.
          </footer>
        </div>
      </main>

      {/* Footer Global */}
      <div style={{ 
        textAlign: 'center', 
        padding: '20px', 
        color: '#5f6368', 
        fontSize: '14px' 
      }}>
        Google Formularios
      </div>

      {/* Estilos para animaciones */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
