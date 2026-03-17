from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse
from app.services.chat_service import get_chat_response

router = APIRouter()

# In-memory session history store (per session_id)
session_histories: dict[str, list] = {}


@router.post("", response_model=ChatResponse)
async def chat(body: ChatRequest):
    session_id = body.session_id

    if not body.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    history = session_histories.get(session_id, [])

    try:
        reply = get_chat_response(
            session_id=session_id,
            message=body.message,
            detection_results=body.detection_results,
            history=history,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"BioSecure AI unavailable: {str(e)}")

    # Append exchange to session history
    history.append({"role": "user", "content": body.message})
    history.append({"role": "assistant", "content": reply})
    session_histories[session_id] = history

    return ChatResponse(session_id=session_id, reply=reply)
