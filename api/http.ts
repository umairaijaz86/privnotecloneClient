//API web client 
const ENV = import.meta.env;
//Get the base URL from the env file
const API_BASE = ENV.BASE_URL;

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