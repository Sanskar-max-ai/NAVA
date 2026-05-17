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
)
from livekit.plugins import google

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nava-agent")


def load_transcript(creator_id: str) -> str:
    """Load the full transcript file for a creator directly into memory."""
    knowledge_dir = os.path.join(os.path.dirname(__file__), "knowledge")
    transcript_path = os.path.join(knowledge_dir, f"{creator_id}.txt")
    
    if os.path.exists(transcript_path):
        with open(transcript_path, "r", encoding="utf-8") as f:
            content = f.read()
        logger.info(f"Loaded transcript for {creator_id}: {len(content)} characters")
        return content
    else:
        logger.warning(f"No transcript file found at {transcript_path}")
        return ""


# Base personality prompts for each creator
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
        "3. You have been given a FULL TRANSCRIPT of your podcast/interview below. Use it to answer questions accurately. "
        "Quote real facts, stories, and details from the transcript when relevant."
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
        "3. You have been given a FULL TRANSCRIPT of your podcast interview with Vijay Mallya below. Use it to answer questions accurately. "
        "Quote real facts, stories, and details from the transcript when relevant."
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
        "3. You have been given a FULL TRANSCRIPT of your podcast/interview below. Use it to answer questions accurately. "
        "Quote real facts, stories, and details from the transcript when relevant."
    )
}


async def entrypoint(ctx: JobContext):
    logger.info(f"Starting agent for room: {ctx.room.name}")

    # Extract creator ID from room name (format: creator-{creatorId}-{random})
    creator_id = "narendra_modi"
    if ctx.room.name.startswith("creator-"):
        parts = ctx.room.name.split("-")
        if len(parts) >= 2:
            creator_id = parts[1]

    logger.info(f"Loading persona for creator: {creator_id}")

    # Load base personality prompt
    base_prompt = CREATOR_PROMPTS.get(
        creator_id, 
        "You are a helpful AI assistant. Keep responses concise and speak in Hinglish."
    )
    
    # Load the full transcript and append it to the instructions
    transcript = load_transcript(creator_id)
    
    if transcript:
        full_instructions = (
            f"{base_prompt}\n\n"
            f"=== FULL PODCAST TRANSCRIPT (USE THIS TO ANSWER QUESTIONS) ===\n\n"
            f"{transcript}\n\n"
            f"=== END OF TRANSCRIPT ==="
        )
    else:
        full_instructions = base_prompt
    
    logger.info(f"Total instruction length: {len(full_instructions)} characters")

    # Initialize the Gemini Realtime Model with the full transcript baked in
    model = google.realtime.RealtimeModel(
        model="gemini-3.1-flash-live-preview",
        instructions=full_instructions,
        voice="Puck",
    )

    # Initialize the agent
    agent = Agent(instructions=full_instructions)

    # Start the session
    session = AgentSession(llm=model)
    await session.start(room=ctx.room, agent=agent)
    
    logger.info(f"Agent is ready and listening for {creator_id}...")

    @ctx.room.on("participant_disconnected")
    def on_participant_disconnected(participant):
        logger.info(f"Participant disconnected: {participant.identity}. Closing room.")
        asyncio.create_task(ctx.room.disconnect())


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
        )
    )
