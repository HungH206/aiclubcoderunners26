import google.generativeai as genai
import os

# -----------------------------------------
# 1. Configure your API key
# -----------------------------------------
# Make sure you set your API key in your environment:
#   export GEMINI_API_KEY="YOUR_KEY_HERE"
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# -----------------------------------------
# 2. Load the Gemini model
# -----------------------------------------
model = genai.GenerativeModel("gemini-pro")

# -----------------------------------------
# 3. Send a prompt and get a response
# -----------------------------------------
prompt = "Explain binary trees in simple terms."

response = model.generate_content(prompt)

# -----------------------------------------
# 4. Print the model output
# -----------------------------------------
print("\n=== Gemini Response ===\n")
print(response.text)