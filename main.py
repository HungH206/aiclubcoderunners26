import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv()

# -----------------------------------------
# 1. Configure your API key
# -----------------------------------------
# Make sure you set your API key in your environment:
#   export GEMINI_API_KEY="YOUR_KEY_HERE"
genai.configure(api_key=os.environ["GEMINI_API_KEY"])


# -----------------------------------------
# 2. Load the Gemini model
# -----------------------------------------
model = genai.GenerativeModel("gemini-3.5-flash")

# -----------------------------------------
# 3. Send a prompt and get a response
# -----------------------------------------
prompt = "What are you?"

response = model.generate_content(prompt)

# -----------------------------------------
# 4. Print the model output
# -----------------------------------------
print("\n=== Gemini Response ===\n")
print(response.text)