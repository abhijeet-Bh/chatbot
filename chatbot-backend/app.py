import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

OLLAMA_API_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "gemma:2b"


@app.route("/search", methods=["GET"])
def search():
    query = request.args.get("query", "").strip()
    if not query:
        return jsonify({"response": "Please provide a query."})

    payload = {"model": MODEL_NAME, "prompt": query}
    response_text = ""

    try:
        with requests.post(OLLAMA_API_URL, json=payload, stream=True) as response:
            if response.status_code != 200:
                return jsonify({"response": f"Error from Ollama: {response.status_code}"})

            for line in response.iter_lines():
                if line:
                    try:
                        json_data = json.loads(line.decode("utf-8"))
                        response_text += json_data.get("response", "")
                    except json.JSONDecodeError as e:
                        print("JSON Parsing Error:", e)
                        continue

        return jsonify({"response": response_text.strip()})

    except requests.exceptions.RequestException as e:
        print("Error connecting to Ollama:", e)
        return jsonify({"response": f"Error connecting to Ollama: {str(e)}"})


if __name__ == "__main__":
    app.run(debug=True)