import logging
import os
import asyncio
from dotenv import load_dotenv
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    WorkerOptions,
    cli,
    llm,
)
from livekit.plugins import google
import requests
import chromadb

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nava-agent")

# Configure Gemini API Key
api_key = os.getenv("GOOGLE_API_KEY")

class CreatorAgent(Agent):
    def __init__(self, creator_id: str, instructions: str):
        super().__init__(instructions=instructions)
        self.creator_id = creator_id
        
        # Initialize local ChromaDB client resiliently
        db_path = os.path.join(os.path.dirname(__file__), "chroma_db")
        self.chroma_client = chromadb.PersistentClient(path=db_path)
        self.collection = self.chroma_client.get_or_create_collection(name="creator_knowledge")

    @llm.function_tool
    async def search_knowledge_base(self, query: str) -> str:
        """Search the creator's personal knowledge base for specific facts, stories, or business advice.
        
        Args:
            query: The specific question or search query to look up.
        """
        logger.info(f"RAG: Searching database for: {query}")
        
        # Generate query embedding using Gemini HTTP API with retries for 429 rate limits
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key={api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "model": "models/gemini-embedding-2",
            "content": {
                "parts": [{"text": query}]
            }
        }
        
        max_retries = 3
        backoff = 0.5
        vector = None
        
        for attempt in range(max_retries):
            try:
                import asyncio
                from functools import partial
                
                loop = asyncio.get_event_loop()
                response = await loop.run_in_executor(
                    None, 
                    partial(requests.post, url, headers=headers, json=payload, timeout=5)
                )
                
                if response.status_code == 429:
                    logger.warning(f"RAG embedding API rate limited (429). Retrying in {backoff}s... (Attempt {attempt+1}/{max_retries})")
                    await asyncio.sleep(backoff)
                    backoff *= 2.0
                    continue
                    
                response.raise_for_status()
                data = response.json()
                vector = data["embedding"]["values"]
                break
            except Exception as e:
                logger.error(f"RAG Embedding Attempt {attempt+1} failed: {e}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(backoff)
                    backoff *= 2.0
                else:
                    return "Failed to search the knowledge base due to a database/embedding error."
                    
        if not vector:
            return "Failed to search the knowledge base because embedding could not be generated."
            
        try:
            # Query ChromaDB using the embedding
            results = self.collection.query(
                query_embeddings=[vector],
                n_results=2,
                where={"creator_id": self.creator_id}
            )
            
            documents = results.get("documents", [[]])[0]
            if not documents:
                return "No matching facts found in the knowledge base."
                
            context = "\n\n".join(documents)
            logger.info(f"RAG: Found {len(documents)} matching facts.")
            return context
            
        except Exception as e:
            logger.error(f"RAG Chroma Query Error: {e}")
            return "Failed to query the knowledge base due to a database error."

# Mock database for creator prompts
CREATOR_PROMPTS = {
    "narendra_modi": (
        "You are an AI trained to represent the leadership and vision of Narendra Modi, the Prime Minister of India. "
        "Your tone is deeply patriotic, authoritative yet humble, and highly focused on development (Vikas), "
        "digital India, and youth empowerment. You speak thoughtfully and respectfully. "
        "CRITICAL SPEAKING STYLE RULES (MUST OBEY OR THE SESSION WILL FAIL):\n"
        "1. You MUST speak entirely in 'Hinglish'—a native blend of Hindi and English written in Roman script. "
        "Never reply in pure formal English or pure formal Hindi. "
        "Always mix English phrases and Hindi words in every single turn (e.g., 'Aapne bilkul sahi question pucha. Today we are talking about India's scaling capability, hume digital infrastructure build karna hai.').\n"
        "2. Keep your answers extremely concise, conversational, and direct, suitable for a fast-paced voice call. Avoid long monologues.\n"
        "3. You have access to a search_knowledge_base tool. If asked about your vision, daily routine, "
        "or specific projects, you MUST search the knowledge base first and use that context to answer in Hinglish."
    ),
    "raj_shamani": (
        "You are an AI trained to represent the entrepreneurial mindset of Raj Shamani, a top Indian podcaster and entrepreneur. "
        "Your tone is energetic, highly motivational, and practical. You speak like a friend who gives tough love. "
        "You love talking about sales psychology, direct marketing, soaps business beginnings, and personal branding. "
        "CRITICAL SPEAKING STYLE RULES (MUST OBEY OR THE SESSION WILL FAIL):\n"
        "1. You MUST speak entirely in casual, trendy 'Hinglish'—a dynamic mix of Hindi and English written in Roman script. "
        "Never speak in pure formal English or pure formal Hindi. "
        "Always blend English terms like branding, sales, and marketing with native casual Hindi (e.g., 'Hello dost, kaise ho? Business build karne ka game bohot simple hai, start with direct sales and direct relationship building.').\n"
        "2. Keep your answers extremely concise, conversational, and direct, suitable for a fast-paced voice call. Avoid long monologues.\n"
        "3. You have access to a search_knowledge_base tool. If asked about your story, branding frameworks, "
        "or specific business advice, you MUST search the knowledge base first and use that context to answer in Hinglish."
    ),
    "ratan_tata": (
        "You are an AI trained to represent the wisdom of Ratan Tata, one of India's most respected industrialists. "
        "Your tone is soft-spoken, incredibly polite, ethical, and deeply compassionate. "
        "You advise on building businesses that serve society, long-term thinking, and philanthropy. "
        "CRITICAL SPEAKING STYLE RULES (MUST OBEY OR THE SESSION WILL FAIL):\n"
        "1. You MUST speak entirely in gentle, warm 'Hinglish'—a polite blend of Hindi and English written in Roman script. "
        "Never reply in pure formal English or pure formal Hindi. "
        "Always mix terms (e.g., 'Ethics and trust building humare business ke fundamentals hain, let's keep focusing on long-term sustainability.').\n"
        "2. Keep your answers extremely concise, conversational, and direct, suitable for a fast-paced voice call.\n"
        "3. You have access to a search_knowledge_base tool. If asked about your leadership style, philanthropy, "
        "or projects like the Tata Nano, you MUST search the knowledge base first and use that context to answer in Hinglish."
    )
}

CREATOR_GREETINGS = {
    "narendra_modi": "Namaste, kaise hain aap? Let's talk about India's future and development.",
    "raj_shamani": "Hello dost, kaise ho? Raj Shamani here. Batao aaj kya scale karna hai?",
    "ratan_tata": "Namaste, welcome. Kaise hain aap? Main Ratan Tata."
}

async def entrypoint(ctx: JobContext):
    logger.info(f"Starting agent for room: {ctx.room.name}")

    # Extract creator ID from room name (format: creator-{creatorId}-{random})
    # Default to narendra_modi if parsing fails
    creator_id = "narendra_modi"
    if ctx.room.name.startswith("creator-"):
        parts = ctx.room.name.split("-")
        if len(parts) >= 2:
            creator_id = parts[1]
            
    # Load specific prompt or default
    creator_prompt = CREATOR_PROMPTS.get(
        creator_id, 
        "You are a helpful AI assistant. Keep responses concise and speak in Hinglish."
    )
    
    logger.info(f"Loading persona for creator: {creator_id}")

    # Initialize the Gemini Realtime Model
    model = google.realtime.RealtimeModel(
        model="gemini-2.0-flash-exp",
        instructions=creator_prompt,
        voice="Puck", # Options: Puck, Charon, Kore, Fenrir, Aoede
    )

    # Initialize the dynamic personality with the tool
    agent = CreatorAgent(
        creator_id=creator_id,
        instructions=creator_prompt,
    )

    # Start the session with the multimodal model
    session = AgentSession(llm=model)
    
    # Connect and run
    await session.start(room=ctx.room, agent=agent)
    
    logger.info("Agent is ready. Waiting for user to speak (Gemini 3.1 Flash Live)...")

    @ctx.room.on("participant_disconnected")
    def on_participant_disconnected(participant):
        logger.info(f"Participant disconnected: {participant.identity}. Closing room.")
        import asyncio
        asyncio.create_task(ctx.room.disconnect())

    
    # Optional: Greet the user when they join
    # For Gemini Realtime, we can use the model to generate a greeting
    # Or just wait for the user to speak.
    
    logger.info("Agent is ready and listening...")

if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
        )
    )
