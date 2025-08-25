import { useMemo, useState } from "react";
import { createNote } from "../api/http";

import '../assets/CreateNote.css';

type ExpiryOption = {label: string, value: number};

//Expiration time options for the note
const EXPIRY_OPTIONS: ExpiryOption[] = [
    { label: '5 minutes', value: 5 },
    { label: '1 hour', value: 60 },
    { label: '1 day', value: 60 * 24 },
    { label: '1 week', value: 60 * 24 * 7 },
  ];

  export default function CreateNote() {
    
    // State for the note content and expiry option`
    const [message, setMessage] = useState('');
    const [expiry, setExpiry] = useState<number>(60);
    const [loading, setLoading] = useState(false);
    const [shareURL, setShareURL] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    /**
     * Determines if the note can be submitted based on the message content.
     * The note can be submitted if the message is not empty after trimming whitespace.
     */
    const canSubmit = useMemo(() => { return message.trim().length > 0}, [message, loading]);

    // Call the api on submit
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!canSubmit) return;
        
        setLoading(true);
        setError(null);
        setShareURL(null);
        setCopied(false);

        try {
            // Call the API to create the note
            const res = await createNote({ message, expiresInMinutes: expiry });
            // Set the share url
            setShareURL(`${window.location.origin}/n/${res.id}`);
            // reset the message value
            setMessage('');

        } catch (error:any) {
            setError(error.message || 'Failed to create note');
        } finally {
            setLoading(false);
        }
    };
 
    // copy link to clipboard
    const copyLink = async () => {
        if (!shareURL) return;
        try {
            await navigator.clipboard.writeText(shareURL);
            setCopied(true);
        } catch (error) {
            setError('Failed to copy link');
        }
    };

    // Render the CreateNote component
    return (
        <div className="container">
            <div className="card">
                <div className="title">Ceate your Secure-Note</div>
                <p className="subtitle">
                    your note will be encrypted and self distruct after it's read once.
                </p>
                <form onSubmit={onSubmit} className="form">
                    <label className="label">Message</label>
                    <textarea 
                        placeholder="Enter your note here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="textarea"
                        rows={8}></textarea>

                    <label className="label">Expiry</label>
                    <select 
                        value={expiry}
                        onChange={(e) => setExpiry(Number(e.target.value))}
                        className="select">
                        {EXPIRY_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="button" disabled={loading || !canSubmit}>
                        {loading ? 'Creating...' : 'Create Note'}
                    </button>
                </form>
                {error && <div className="error">{error}</div>}
                {shareURL && (
                    <div className="resultBox">
                        <div style={{ marginBottom: 8, fontWeight: 600}}>Share this link </div>
                        <code className="code">{shareURL}</code>
                        <div style={{height: 8}} />
                        <button 
                            onClick={copyLink} className= "secondaryButton">
                            {copied ? 'Copied!' : 'Copy Link'}        
                        </button>
                    </div>
                )}
            </div>
            <p className="footerNote">
                !! Anyone with the link can view the note exactly once. After that, it's gone.
            </p>
        </div>
    );
  }

 