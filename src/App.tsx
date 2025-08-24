import { Routes, Route, Link } from 'react-router-dom';
import CreateNote from './pages/CreateNote'
import ReadNote from './pages/ReadNote';


function App() {
  return (
    <>
      <header style={{ padding: 12, background: '#0b1220', borderBottom: '1px solid #1f2a44' }}>
        <Link to="/" style={{ color: '#e6e8eb', textDecoration: 'none', fontWeight: 700 }}>
          Secure Notes
        </Link>
      </header>
      <Routes>
        <Route path="/" element= {<CreateNote />} />
        <Route path="/n/:id" element={<ReadNote />} />
        <Route path="*" element={<div style={{ padding: 20 }}>Page not found</div>} />
      </Routes>
    </>
  )
}

export default App
