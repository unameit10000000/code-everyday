import os
import httpx
from flask import Flask, request, jsonify
from flask_cors import CORS
from clerk_backend_api import Clerk
from clerk_backend_api.jwks_helpers import authenticate_request, AuthenticateRequestOptions

app = Flask(__name__)
# Configure CORS to allow requests from the Next.js frontend
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000"]}})

# Initialize Clerk client with your secret key
CLERK_SECRET_KEY = os.getenv('CLERK_SECRET_KEY', 'your_clerk_secret_key')
clerk = Clerk(bearer_auth=CLERK_SECRET_KEY)

def is_authenticated(request):
    try:
        # Extract headers from Flask request
        headers = dict(request.headers)
        auth_header = headers.get('Authorization')
        
        if not auth_header:
            return False, None
        
        # Create a httpx.Request for Clerk to authenticate
        httpx_request = httpx.Request(
            method="GET",
            url=request.url,
            headers=headers
        )
        
        # Authenticate the request using Clerk
        request_state = clerk.authenticate_request(
            httpx_request,
            AuthenticateRequestOptions(
                # Your Next.js app URL
                authorized_parties=["http://localhost:3000"]
            )
        )
        
        return request_state.is_signed_in, request_state.payload
    except Exception as e:
        print(f"Authentication error: {str(e)}")
        return False, None

@app.route('/', methods=['GET'])
def index():
    return jsonify({"message": "Welcome to the API!"})

@app.route('/api/protected-resource', methods=['GET'])
def protected_resource():
    is_signed_in, payload = is_authenticated(request)
    
    if not is_signed_in:
        return jsonify({"error": "Unauthorized - you must be signed in"}), 401
    
    # Dummy data that would be replaced with actual DB data
    dummy_data = {
        "items": [
            {"id": 1, "name": "Protected Item 1", "description": "Secret data 1"},
            {"id": 2, "name": "Protected Item 2", "description": "Secret data 2"},
            {"id": 3, "name": "Protected Item 3", "description": "Secret data 3"}
        ],
        "user_id": payload.get("sub") if payload else "unknown"
    }
    
    return jsonify(dummy_data)

@app.route('/api/public-resource', methods=['GET'])
def public_resource():
    # Public data anyone can access
    return jsonify({
        "message": "This is public data that doesn't require authentication"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)