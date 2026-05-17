# NAVA: AI Voice Agent SaaS Roadmap

This document tracks the progress and future plans for the NAVA platform. A B2B2C marketplace where creators (influencers, experts, podcasters) can create AI Voice Clones trained on their data. 
* **Revenue Model**: 70-80% to Creators, 20-30% to Platform.
* **Technology**: LiveKit for WebRTC, Gemini 3.1 Flash for brain, Supabase pgvector for RAG, and self-hosted Fish Speech for cost-effective voice cloning.

## ✅ Phase 1: Core Voice Infrastructure (COMPLETED)
- [x] Initialize Next.js 15 Frontend with Tailwind v4.
- [x] Setup Python Agent Worker with LiveKit Agents SDK.
- [x] Integrate **Gemini 3.1 Flash Live** for ultra-low latency voice.
- [x] Fix Tailwind v4 CSS utility issues.
- [x] Resolve `AgentSession` initialization bugs in the Python worker.
- [x] Test and verify real-time voice connection.

## 🏗️ Phase 2: Premium Dashboard & Management (CURRENT)
- [x] Design high-end Dashboard Sidebar and Navigation.
- [x] Build **Overview Command Center** with mock metrics.
- [x] Build **Agent Management UI** (Card-based configuration).
- [ ] **NEXT STEP**: Setup Supabase Project.
- [ ] Implement Authentication (Login/Signup).
- [ ] Connect Database to make Agent names and instructions dynamic.

## 📞 Phase 3: Telephony & Vobiz Integration (UPCOMING)
## 📞 Phase 3: Telephony & Vobiz Integration (UPCOMING)
- [ ] Configure LiveKit SIP for telephony support.
- [ ] Connect **Vobiz Indian Phone Numbers**.
- [ ] Implement Inbound call routing to specific Creator Agents.
- [ ] Implement Outbound calling API.

## 🎙️ Phase 4: Open Source Voice Cloning (UPCOMING)
- [ ] Setup dedicated GPU VPS for voice generation.
- [ ] Deploy **Fish Speech** (or similar open-source TTS) for highly realistic, low-cost voice cloning.
- [ ] Integrate custom TTS engine into the LiveKit pipeline.

## 🧠 Phase 4: Intelligence & RAG (UPCOMING)
- [ ] Integrate Vector Database (Supabase pgvector).
- [ ] Build Knowledge Base upload UI (PDF/Text).
- [ ] Implement RAG pipeline for agent-specific knowledge.
- [ ] Add Function Tools (e.g., booking appointments in Google Calendar/DB).

---

## 🛠️ Current Running Ports:
- **Frontend**: http://localhost:3001
- **Agent Worker**: Running in terminal (listening for jobs)
