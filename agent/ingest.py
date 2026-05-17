import os
import glob
import chromadb
import requests
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API Key
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY environment variable is missing!")

# Initialize ChromaDB client (persistent on disk in ./chroma_db)
db_path = os.path.join(os.path.dirname(__file__), "chroma_db")
client = chromadb.PersistentClient(path=db_path)

# Create or get the creator knowledge collection
collection = client.get_or_create_collection(
    name="creator_knowledge",
    metadata={"hnsw:space": "cosine"}
)

import time

def get_embedding(text: str) -> list[float]:
    """Generate embedding vector using Gemini's gemini-embedding-2 API via raw HTTP request with exponential backoff on 429."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "model": "models/gemini-embedding-2",
        "content": {
            "parts": [{"text": text}]
        }
    }
    
    max_retries = 5
    backoff = 1.0  # Start with 1 second delay
    
    for attempt in range(max_retries):
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=10)
            
            if response.status_code == 429:
                print(f"Rate limited (429) for text: {text[:30]}... Retrying in {backoff:.1f}s (Attempt {attempt+1}/{max_retries})")
                time.sleep(backoff)
                backoff *= 2.0
                continue
                
            response.raise_for_status()
            data = response.json()
            # Small sleep to be gentle to the rate limiter
            time.sleep(0.2)
            return data["embedding"]["values"]
        except Exception as e:
            print(f"Error generating embedding for text: {text[:30]}... - {e}")
            if 'response' in locals() and hasattr(response, 'text'):
                print(f"Response details: {response.text}")
            if attempt < max_retries - 1:
                time.sleep(backoff)
                backoff *= 2.0
            else:
                return []
    return []

def ingest_files():
    knowledge_dir = os.path.join(os.path.dirname(__file__), "knowledge")
    file_paths = glob.glob(os.path.join(knowledge_dir, "*.txt"))
    
    if not file_paths:
        print("No text files found in the knowledge directory!")
        return

    print(f"Found {len(file_paths)} knowledge files to process...")

    for path in file_paths:
        filename = os.path.basename(path)
        creator_id = os.path.splitext(filename)[0]
        
        print(f"\nProcessing {filename} (Creator: {creator_id})...")
        
        with open(path, "r", encoding="utf-8") as f:
            lines = f.readlines()
            
        chunks = []
        current_chunk = []
        current_word_count = 0
        
        # Check if the file is a timestamped transcript (like raj_shamani)
        is_transcript = any("minutes" in line or "seconds" in line or ":" in line for line in lines[:50])
        
        if is_transcript:
            print(f"Detected transcript format for {filename}. Parsing dialogues...")
            
            # Helper to parse transcript lines and group conversational segments cleanly
            for line in lines:
                line_str = line.strip()
                if not line_str:
                    continue
                
                # Check for chapter marks
                if line_str.startswith("Chapter"):
                    if current_chunk:
                        chunks.append("\n".join(current_chunk))
                        current_chunk = []
                    chunks.append(line_str)
                    continue
                
                # Group dialogue chunks to hold roughly 150-250 words per chunk for rich RAG context
                current_chunk.append(line_str)
                current_word_count += len(line_str.split())
                
                if current_word_count >= 200:
                    chunks.append("\n".join(current_chunk))
                    current_chunk = []
                    current_word_count = 0
            
            if current_chunk:
                chunks.append("\n".join(current_chunk))
        else:
            # Standard knowledge file split by paragraph
            content = "".join(lines)
            chunks = [c.strip() for c in content.split("\n\n") if c.strip()]
        
        if not chunks:
            print(f"Skipping {filename} - no valid chunks found.")
            continue
            
        print(f"Splitting into {len(chunks)} chunks...")
        
        documents = []
        metadatas = []
        ids = []
        embeddings = []
        
        for idx, chunk in enumerate(chunks):
            # Compute Gemini embedding
            vector = get_embedding(chunk)
            if not vector:
                continue
                
            documents.append(chunk)
            metadatas.append({"creator_id": creator_id})
            ids.append(f"{creator_id}_{idx}")
            embeddings.append(vector)
            
        if documents:
            # Upsert into ChromaDB
            collection.upsert(
                ids=ids,
                documents=documents,
                metadatas=metadatas,
                embeddings=embeddings
            )
            print(f"Successfully ingested {len(documents)} chunks for {creator_id}!")
            
    print("\nIngestion complete! Vector Database is populated.")

if __name__ == "__main__":
    ingest_files()
