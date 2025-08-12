import os
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()

api_key = os.getenv('ANTHROPIC_API_KEY')

try:
    client = Anthropic(api_key=api_key)
    
    # Try the current Claude 3.5 Sonnet model
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=10,
        messages=[{"role": "user", "content": "Hello"}]
    )
    print("✅ API key works with current model!")
    print(f"Response: {response.content[0].text}")
except Exception as e:
    print(f"❌ Current model test failed: {e}")
    
    # Try alternative model
    try:
        response = client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=10,
            messages=[{"role": "user", "content": "Hello"}]
        )
        print("✅ API key works with legacy model!")
    except Exception as e2:
        print(f"❌ Legacy model also failed: {e2}")
