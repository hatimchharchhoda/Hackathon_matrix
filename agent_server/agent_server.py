"""
Agentic AI Local Network Server
================================
Hosts an agentic AI assistant accessible to any device on your local network.
Uses the Anthropic API with tool-use (web search) for agentic capabilities.

Requirements:
    pip install anthropic flask flask-cors requests

Usage:
    python agentic_ai_server.py
    Then open http://<your-local-ip>:5000 on any device on the same network.
"""

import os
import json
import socket
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from agent import run_agent

# ── Configuration ─────────────────────────────────────────────────────────────

# API_KEY     = os.getenv("ANTHROPIC_API_KEY", "your_api_key_here")
# MODEL       = "claude-sonnet-4-20250514"
HOST        = "0.0.0.0"   # Listen on all interfaces → reachable across LAN
PORT        = 5001
# MAX_TOKENS  = 4096

# # Agent system prompt – customise freely
# SYSTEM_PROMPT = """You are a helpful agentic AI assistant running on a local network server.
# You can search the web, reason step-by-step, and complete multi-step tasks autonomously.
# Always explain what you are doing and why."""

# # ── Tools available to the agent ──────────────────────────────────────────────

# TOOLS = [
#     {
#         "type": "web_search_20250305",
#         "name": "web_search",
#     }
# ]

# ── Flask app ─────────────────────────────────────────────────────────────────

app = Flask(__name__)
CORS(app)                           # Allow requests from any device on the LAN

# client = anthropic.Anthropic(api_key=API_KEY)


# ── Helper: get local IP ───────────────────────────────────────────────────────

def get_local_ip() -> str:
    """Return the machine's LAN IP address."""
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        try:
            s.connect(("8.8.8.8", 80))
            return s.getsockname()[0]
        except Exception:
            return "127.0.0.1"


# ── Agentic loop ───────────────────────────────────────────────────────────────

# def run_agent(messages: list, max_iterations: int = 10) -> dict:
#     """
#     Runs the agentic loop:
#       1. Send messages to Claude with tools enabled.
#       2. If Claude calls a tool, execute it and feed the result back.
#       3. Repeat until Claude returns a final text response or max_iterations hit.

#     Returns a dict with 'response' (str) and 'iterations' (int).
#     """
#     iterations = 0

#     while iterations < max_iterations:
#         iterations += 1

#         response = client.messages.create(
#             model=MODEL,
#             max_tokens=MAX_TOKENS,
#             system=SYSTEM_PROMPT,
#             tools=TOOLS,
#             messages=messages,
#         )

#         # Append assistant message to history
#         messages.append({"role": "assistant", "content": response.content})

#         # ── Final answer ──────────────────────────────────────────────────────
#         if response.stop_reason == "end_turn":
#             text_parts = [
#                 block.text
#                 for block in response.content
#                 if hasattr(block, "text")
#             ]
#             return {
#                 "response": "\n".join(text_parts),
#                 "iterations": iterations,
#             }

#         # ── Tool use ──────────────────────────────────────────────────────────
#         if response.stop_reason == "tool_use":
#             tool_results = []

#             for block in response.content:
#                 if block.type != "tool_use":
#                     continue

#                 print(f"  [Tool call] {block.name}({json.dumps(block.input)[:120]})")

#                 # Web search is handled server-side by Anthropic – we just
#                 # pass the result blocks back as tool_result messages.
#                 tool_results.append({
#                     "type": "tool_result",
#                     "tool_use_id": block.id,
#                     # The actual search is executed by the Anthropic backend;
#                     # returning an empty content here tells the SDK to use the
#                     # server-side result automatically.
#                     "content": "",
#                 })

#             if tool_results:
#                 messages.append({"role": "user", "content": tool_results})

#             continue  # Next iteration

#         # Unexpected stop reason – return whatever we have
#         break

#     return {
#         "response": "Agent reached maximum iterations without a final answer.",
#         "iterations": iterations,
#     }


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.route("/", methods=["GET"])
def index():
    """Simple status page."""
    local_ip = get_local_ip()
    return jsonify({
        "status": "running",
        "message": "Agentic AI Server is live",
        "local_url": f"http://{local_ip}:{PORT}",
        "endpoints": {
            "chat":     f"POST /chat     — send prospect data, generates document",
            "download": f"GET  /download — fetch the generated proposal .docx",
            "health":   f"GET  /health   — server health check",
        },
    })


# @app.route("/health", methods=["GET"])
# def health():
#     return jsonify({"status": "ok", "model": MODEL})


@app.route("/chat", methods=["POST"])
def chat():
    """
    Accepts JSON body:
      {
        "message": "Your question here",
        "history": [                          ← optional conversation history
          {"role": "user",      "content": "..."},
          {"role": "assistant", "content": "..."}
        ]
      }

    Returns:
      {
        "response":   "Agent's reply",
        "iterations": 3,
        "model":      "claude-sonnet-4-20250514"
      }
    """

    data = request.get_json(silent=True)
    print(data)
    if not data or "client_info" not in data:
        return jsonify({"error": "Request body must include 'message'"}), 400

    try:
        result = run_agent(data)
    
    except Exception as exc:
        return jsonify({"error": f"Internal error: {exc}"}), 500

    print(f"[Done]")

    return jsonify({
        "response":   "200 OK"
    })


# ── Download the latest generated proposal ────────────────────────────────────

GENERATED_DOC_PATH = os.path.join(os.path.dirname(__file__), "proposal_techcorp.docx")

@app.route("/download", methods=["GET"])
def download():
    """
    Serves the most recently generated proposal .docx file.
    The frontend calls this after a successful POST /chat to fetch the document.
    """
    if not os.path.exists(GENERATED_DOC_PATH):
        return jsonify({"error": "No document has been generated yet."}), 404

    from flask import send_file
    return send_file(
        GENERATED_DOC_PATH,
        mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        as_attachment=False,          # False → browser can try to preview it inline
        download_name="proposal_techcorp.docx",
    )


# ── Entry point ────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    local_ip = get_local_ip()

    print("=" * 60)
    print("  Agentic AI Local Network Server")
    print("=" * 60)
    print(f"  Local URL  : http://localhost:{PORT}")
    print(f"  Network URL: http://{local_ip}:{PORT}")
    print("  Press Ctrl+C to stop.")
    print("=" * 60)

    # debug=False + threaded=True for stable multi-device usage
    app.run(host=HOST, port=PORT, debug=False, threaded=True)