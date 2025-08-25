import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HttpError, readNote } from '../api/http';
import '../assets/ReadNote.css';


 // ReadNote component to fetch and displays a secure note based on the note ID
export default function ReadNote() {
  // read the note ID from the URL like /n/abc123
  const { id } = useParams<{ id: string }>();

  // local UI state
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null); // HTTP status for nuanced messages

  useEffect(() => {
    if (!id) return
  
    // if we've already stored the message or error in state, do nothing
    if (message || error) return
  
    setLoading(true)
    setError(null)
    setMessage(null)
    setStatus(null)
  
    // Immediately call the API to read the note
    ;(async () => {
      try {
        const res = await readNote(id)
        setMessage(res.message)
      } catch (e: any) {
        if (e instanceof HttpError) {
          setStatus(e.status)
          setError(e.message)
        } else {
          setError('Unexpected error while reading the note')
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [id, message, error]);

  return (
    <div className="read-container">
      <div className="read-card">
        <h1 className="read-title">Read Secure Note</h1>
        <p className="read-subtitle">This link works only once. After reading, the note is deleted.</p>

        {loading && <div className="read-status">Loading note…</div>}

        {!loading && message && (
          <div className="read-message">
            <div className="read-label">Message</div>
            <pre className="read-pre">{message}</pre>
            <div className="read-info">✅ The note was destroyed after this view.</div>
          </div>
        )}

        {!loading && !message && error && (
          <div className="read-error">
            <div className="read-label">Cannot read this note</div>
            <p className="read-error-text">
              {/* If your backend later returns 410 for "already read", we can show a clearer message */}
              {status === 404 && 'Note not found or expired.'}
              {status === 410 && 'This note was already read and is no longer available.'}
              {status !== 404 && status !== 410 && error}
            </p>
          </div>
        )}

        <div className="read-actions">
          <Link to="/" className="read-button">
            Create a new note
          </Link>
        </div>
      </div>
    </div>
  );
}
