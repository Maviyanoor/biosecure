import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

SYSTEM_PROMPT = """You are BioSecure AI, an expert deepfake detection assistant.
Help users understand their analysis results clearly and professionally.
Never mention Llama, Groq, or OpenAI. You are BioSecure AI only."""


def get_chat_response(session_id: str, message: str, detection_results: dict, history: list) -> str:
    client = OpenAI(
        api_key=os.getenv("GROQ_API_KEY"),
        base_url="https://api.groq.com/openai/v1",
    )

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Analysis: {detection_results}"},
        {"role": "assistant", "content": "I have reviewed the analysis results."},
        *history,
        {"role": "user", "content": message},
    ]

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        max_tokens=300,
        temperature=0.7,
    )

    return response.choices[0].message.content
