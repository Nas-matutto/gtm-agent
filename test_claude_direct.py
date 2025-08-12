import os
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()

api_key = os.getenv('ANTHROPIC_API_KEY')
print(f"API Key length: {len(api_key) if api_key else 0}")
print(f"API Key prefix: {api_key[:15] if api_key else 'None'}...")

try:
    client = Anthropic(api_key=api_key)
    response = client.messages.create(
        model="claude-3-sonnet-20240229",
        max_tokens=10,
        messages=[{"role": "user", "content": "Hello"}]
    )
    print("✅ API key works!")
    print(f"Response: {response.content[0].text}")
except Exception as e:
    print(f"❌ API key test failed: {e}")
