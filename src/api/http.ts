//API web client 
//Get the base URL from the env file
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// THe expected input model
export type CreateNoteRequest = {
    message: string;
    expiresInMinutes?: number;
}

// The promised output model
export type CreateNoteResponse = {
    id: string;
    url:string;
};

// The promised output model for reading a note
export type ReadNoteResponse = { message: string };

// Custom error shape so the UI can branch on status easily
export class HttpError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
    }
  }

// Function to create a note
export async function createNote(body: CreateNoteRequest): Promise<CreateNoteResponse>{

    // Call the api endpoint for creating notes
    const res = await fetch(`${API_BASE}/api/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });   

    // If response is not 200 or 201 
    if (!res.ok){
        // get the error message from the response
        const err = await res.json().catch(()=>({}));
        // Throw a new Error with the message from the response or just say "failed to create"
        throw new Error(err.message || 'Failed to create note');
    }
    // If response is ok, return the JSON response
    return res.json();
}

// Read a note once. Backend should return 200 with { message }
// If note doesn't exist/expired -> 404; if already read -> 410 (optional backend enhancement)
export async function readNote(id: string): Promise<ReadNoteResponse> {
    const res = await fetch(`${API_BASE}/api/notes/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    // if the response is not successful then throw error
    if (!res.ok) {
      let msg = `Request failed with ${res.status}`;
      try {
        const body = await res.json();
        if (typeof body?.error === 'string') msg = body.error;
      } catch {
        // ignore JSON parse errors
      }
      // Throw a typed error so the UI can show precise messages
      throw new HttpError(res.status, msg);
    }
  
    return res.json();
  }