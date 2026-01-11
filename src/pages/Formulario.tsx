// src/pages/Formulario.tsx
import { useState, useEffect } from 'react'
import logoUss from '../assets/uss.png'

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzUBmWu9k8AxxAWfjpxkYRl97mrPsxxqRXWwJ7M8eFLQtgHKRyinH_rnuj9GdLVTcKd/exec"

const preguntas = [
  "¿El docente presenta las diapositivas de manera clara y organizada al inicio de la sesión?",
  "¿Expone los objetivos de la sesión y los relaciona con los temas desarrollados?",
  "¿Los temas tratados durante la clase se ajustan a los objetivos planteados?",
  "¿La explicación de los contenidos es clara y facilita la comprensión?",
  "¿El docente realiza una práctica guiada que permite aplicar lo aprendido paso a paso?",
  "¿La práctica guiada es suficiente para que los estudiantes comprendan el procedimiento?",
  "¿El docente deja una práctica individual para que los estudiantes la desarrollen por su cuenta?",
  "¿La práctica individual está bien planteada y permite reforzar lo aprendido en la sesión?",
  "¿El docente presenta conclusiones claras al finalizar la sesión?",
  "¿Las conclusiones ayudan a relacionar los contenidos vistos con los objetivos iniciales?"
]

const opciones = ["Nunca", "Rara vez", "A veces", "Frecuentemente", "Siempre"]

// Iconos SVG con colores personalizados
const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5a2290" strokeWidth="2.5">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
  </svg>
)

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#63ed12" strokeWidth="2.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5a2290" strokeWidth="2.5">
    <path d="M14 2 H6 A2 2 0 0 0 4 4 V20 A2 2 0 0 0 6 22 H18 A2 2 0 0 0 20 20 V8 Z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
)

const TeacherIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#63ed12" strokeWidth="2.5">
    <path d="M12 14l9-5-9-5-9 5 9 5z"/>
    <path d="M12 14v7"/>
    <path d="M3 7v11l9 5 9-5V7"/>
  </svg>
)

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M6 9l6 6 6-6"/>
  </svg>
)

// Resto de iconos (Loading, Success, Send)
const LoadingIcon = () => (
  <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" stroke="#5a2290" strokeWidth="8" opacity="0.3"/>
    <circle cx="50" cy="50" r="40" stroke="#63ed12" strokeWidth="8" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset="80">
      <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1.5s" repeatCount="indefinite"/>
    </circle>
  </svg>
)

const SuccessIcon = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#63ed12"/>
    <path d="M30 50 L43 63 L70 37" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
      <animate attributeName="stroke-dasharray" from="0,100" to="100,0" dur="0.6s" fill="freeze"/>
    </path>
  </svg>
)

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M22 2 L2 12.5 L22 23 L16 12.5 Z"/>
    <path d="M22 2 L12 12.5 L22 23"/>
  </svg>
)

export default function Formulario() {
  const [datos, setDatos] = useState<any>(null)
  const [cursoSel, setCursoSel] = useState('')
  const [respuestas, setRespuestas] = useState<string[]>(Array(10).fill(''))
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [exitoModal, setExitoModal] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('eval_data')
    if (!saved) { window.location.href = '/'; return }
    const parsed = JSON.parse(saved)
    setDatos(parsed)
    if (parsed.cursos.length > 0) setCursoSel(parsed.cursos[0].curso)
  }, [])

  if (!datos || !cursoSel) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <LoadingIcon />
          <div style={{ marginTop: '24px', fontSize: '20px', color: '#5a2290', fontWeight: '600' }}>Cargando encuesta...</div>
        </div>
      </div>
    )
  }

  const info = datos.cursos.find((c: any) => c.curso === cursoSel) || datos.cursos[0]
  const progreso = respuestas.filter(r => r !== '').length
  const porcentaje = Math.round((progreso / 10) * 100)

  const enviar = async () => {
    if (respuestas.some(r => !r)) {
      setError("Por favor responde todas las preguntas antes de enviar")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setEnviando(true)
    setError('')

    try {
      const datosEnvio = {
        action: 'submit',
        email: datos.email,
        nombre: info.nombre,
        curso: info.curso,
        pead: info.pead,
        docente: info.docente,
        respuestas: respuestas.join('|||')
      }
      const formData = new URLSearchParams()
      Object.entries(datosEnvio).forEach(([k, v]) => formData.append(k, v as string))

      await fetch(WEB_APP_URL, { method: 'POST', body: formData, mode: 'no-cors' })
      await new Promise(r => setTimeout(r, 1000))
      setExitoModal(true)
      localStorage.removeItem('eval_data')
      setTimeout(() => window.location.href = '/', 5000)
    } catch {
      setError('Error al enviar la encuesta. Intenta nuevamente.')
      setEnviando(false)
    }
  }

  if (exitoModal) {
    return (
      <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
        <div style={{ backgroundColor: 'white', padding: '60px 50px', borderRadius: '20px', textAlign: 'center', maxWidth: '520px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
          <SuccessIcon />
          <h1 style={{ color: '#5a2290', fontSize: '36px', margin: '30px 0 16px', fontWeight: '700' }}>Encuesta Enviada</h1>
          <p style={{ fontSize: '20px', color: '#555', marginBottom: '30px' }}>Gracias por tu valiosa participación</p>
          <div style={{ backgroundColor: '#e8f5e1', padding: '20px', borderRadius: '12px', color: '#1a5e20', fontWeight: '600' }}>
            Tu encuesta ha sido registrada exitosamente
          </div>
          <p style={{ marginTop: '30px', color: '#888', fontSize: '15px' }}>Redirigiendo al inicio en 5 segundos...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Roboto, Arial, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: '#ffffff', borderBottom: '6px solid #63ed12', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px 20px', display: 'flex', justifyContent: 'center' }}>
          <img src={logoUss} alt="Universidad Señor de Sipán" style={{ height: '80px' }} />
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: '680px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 6px rgba(32,33,36,0.28)', overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#5a2290', color: 'white', padding: '32px 48px', textAlign: 'center' }}>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '400' }}>ENCUESTA DE SATISFACCIÓN DOCENTE</h1>
            <div style={{ marginTop: '12px', fontSize: '16px' }}>2026 ENERO</div>
            <div style={{ marginTop: '8px', fontSize: '14px', opacity: 0.9 }}>Tu participación es anónima y confidencial.</div>
          </div>

          <div style={{ padding: '32px 48px' }}>
            {error && (
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fce8e6', color: '#c5221f', borderRadius: '8px', border: '1px solid #f28b82' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#5f6368' }}>
                <span>Progreso de la encuesta</span>
                <span><strong>{progreso}/10</strong> respondidas</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#63ed12', width: `${porcentaje}%`, transition: 'width 0.4s ease' }} />
              </div>
            </div>

            {/* SECCIÓN DE INFORMACIÓN DEL ESTUDIANTE - TOTALMENTE RENOVADA */}
            <div style={{ 
              background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
              border: '1px solid #e0e0e0',
              borderRadius: '16px',
              padding: '28px',
              marginBottom: '32px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '18px', color: '#5a2290', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
                Información del estudiante
              </h3>

              {datos.cursos.length > 1 ? (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', color: '#202124', marginBottom: '8px', fontWeight: '500' }}>
                    Selecciona el curso a encuestar
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select 
                      value={cursoSel}
                      onChange={e => { setCursoSel(e.target.value); setRespuestas(Array(10).fill('')); setError('') }}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        paddingRight: '40px',
                        borderRadius: '12px',
                        border: '2px solid #5a2290',
                        backgroundColor: 'white',
                        fontSize: '16px',
                        color: '#202124',
                        appearance: 'none',
                        cursor: 'pointer',
                        outline: 'none',
                        fontWeight: '500'
                      }}
                    >
                      {datos.cursos.map((c: any) => (
                        <option key={c.curso} value={c.curso}>{c.curso}</option>
                      ))}
                    </select>
                    <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <ChevronDown />
                    </div>
                  </div>
                </div>
              ) : null}

              <div style={{ display: 'grid', gap: '16px', fontSize: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', backgroundColor: '#f0f7ff', borderRadius: '10px' }}>
                  <BookIcon />
                  <div>
                    <strong style={{ color: '#5a2290' }}>Curso:</strong> <span style={{ marginLeft: '8px', color: '#202124' }}>{info.curso}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', backgroundColor: '#e8f5e1', borderRadius: '10px' }}>
                  <UserIcon />
                  <div>
                    <strong style={{ color: '#63ed12' }}>Estudiante:</strong> <span style={{ marginLeft: '8px', color: '#202124' }}>{info.nombre}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', backgroundColor: '#f0f7ff', borderRadius: '10px' }}>
                  <DocumentIcon />
                  <div>
                    <strong style={{ color: '#5a2290' }}>PEAD:</strong> <span style={{ marginLeft: '8px', color: '#202124' }}>{info.pead}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', backgroundColor: '#e8f5e1', borderRadius: '10px' }}>
                  <TeacherIcon />
                  <div>
                    <strong style={{ color: '#63ed12' }}>Docente:</strong> <span style={{ marginLeft: '8px', color: '#202124' }}>{info.docente}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* FIN SECCIÓN RENOVADA */}

            {preguntas.map((p, i) => (
              <div key={i} style={{
                marginBottom: '32px', padding: '24px',
                border: respuestas[i] ? '3px solid #63ed12' : '1px solid #dadce0',
                borderRadius: '12px',
                backgroundColor: respuestas[i] ? '#e8f5e1' : 'white',
                transition: 'all 0.4s ease',
                boxShadow: respuestas[i] ? '0 6px 20px rgba(99, 237, 18, 0.2)' : 'none'
              }}>
                <div style={{ fontSize: '14.5px', color: '#202124', marginBottom: '18px', fontWeight: '500', lineHeight: '1.6' }}>
                  <span style={{
                    backgroundColor: respuestas[i] ? '#63ed12' : '#5a2290',
                    color: 'white', padding: '6px 12px', borderRadius: '8px',
                    marginRight: '12px', fontSize: '13px', fontWeight: 'bold'
                  }}>
                    {String.fromCharCode(97 + i).toUpperCase()}
                  </span>
                  {p} <span style={{ color: '#d93025' }}>*</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {opciones.map(opt => (
                    <label key={opt} style={{
                      display: 'flex', alignItems: 'center', cursor: 'pointer',
                      padding: '16px 18px', borderRadius: '10px',
                      backgroundColor: respuestas[i] === opt ? '#63ed12' : 'transparent',
                      color: respuestas[i] === opt ? 'white' : '#202124',
                      fontWeight: respuestas[i] === opt ? '600' : '400',
                      fontSize: '16px', transition: 'all 0.25s ease'
                    }}
                    onMouseEnter={e => { if (respuestas[i] !== opt) e.currentTarget.style.backgroundColor = '#f5f5f5' }}
                    onMouseLeave={e => { if (respuestas[i] !== opt) e.currentTarget.style.backgroundColor = 'transparent' }}>
                      <input
                        type="radio" name={`q${i}`} checked={respuestas[i] === opt}
                        onChange={() => { const nuevo = [...respuestas]; nuevo[i] = opt; setRespuestas(nuevo); setError('') }}
                        disabled={enviando}
                        style={{ marginRight: '16px', transform: 'scale(1.5)', accentColor: '#63ed12', cursor: 'pointer' }}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px', flexWrap: 'wrap', gap: '16px' }}>
              <button onClick={() => { if (window.confirm('¿Limpiar todas las respuestas?')) setRespuestas(Array(10).fill('')) }}
                disabled={enviando}
                style={{ backgroundColor: 'transparent', color: enviando ? '#ccc' : '#5a2290', border: `1px solid ${enviando ? '#ccc' : '#5a2290'}`, padding: '12px 28px', borderRadius: '8px', fontWeight: '500' }}>
                Limpiar formulario
              </button>

              <button onClick={enviar} disabled={enviando || progreso < 10}
                style={{
                  backgroundColor: (enviando || progreso < 10) ? '#f1f3f4' : '#5a2290',
                  color: (enviando || progreso < 10) ? '#9aa0a6' : 'white',
                  border: 'none', padding: '14px 36px', borderRadius: '8px',
                  fontWeight: '600', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px'
                }}
                onMouseEnter={e => { if (!enviando && progreso >= 10) { e.currentTarget.style.backgroundColor = '#63ed12'; e.currentTarget.style.color = 'black' }}}
                onMouseLeave={e => { if (!enviando && progreso >= 10) { e.currentTarget.style.backgroundColor = '#5a2290'; e.currentTarget.style.color = 'white' }}}>
                {enviando ? <>Enviando... <SendIcon /></> : 'Enviar encuesta'}
              </button>
            </div>

            {progreso < 10 && !error && (
              <div style={{ marginTop: '24px', padding: '14px', backgroundColor: '#fff8e1', color: '#ff6d00', borderRadius: '8px', textAlign: 'center' }}>
                Completa todas las preguntas para poder enviar la encuesta
              </div>
            )}
          </div>

          <footer style={{ backgroundColor: '#f8f9fa', padding: '24px 48px', fontSize: '12px', color: '#5f6368', borderTop: '1px solid #dadce0', textAlign: 'center' }}>
            Nunca envíes contraseñas a través de Formularios de Google.<br />
            Este formulario se creó en el Centro de Informática de la Universidad Señor de Sipán.
          </footer>
        </div>
      </main>

      <div style={{ textAlign: 'center', padding: '20px', color: '#5f6368', fontSize: '14px' }}>
        Google Formularios
      </div>
    </div>
  )
}
