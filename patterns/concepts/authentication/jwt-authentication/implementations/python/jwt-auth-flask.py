# jwt-auth-flask.py

from flask import Flask, request, jsonify, make_response
import jwt
import datetime
from functools import wraps
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev_secret_key')  # In production, use environment variable

# Mock user database
users_db = {
    'user1': {
        'username': 'user1',
        'password': generate_password_hash('password123'),
        'role': 'user'
    },
    'admin': {
        'username': 'admin',
        'password': generate_password_hash('admin123'),
        'role': 'admin'
    }
}

# Authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check if token is in headers
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            # Check if it follows Bearer token format
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        # Return error if no token provided
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            # Decode the token
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = users_db.get(data['username'])
            
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401
        
        # Pass the current user to the route function
        return f(current_user, *args, **kwargs)
    
    return decorated

# Routes
@app.route('/api/login', methods=['POST'])
def login():
    auth = request.json
    
    if not auth or not auth.get('username') or not auth.get('password'):
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})
    
    user = users_db.get(auth.get('username'))
    
    if not user:
        return make_response('User not found', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})
    
    if check_password_hash(user['password'], auth.get('password')):
        # Generate JWT token
        token = jwt.encode({
            'username': user['username'],
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({'token': token})
    
    return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})

@app.route('/api/protected', methods=['GET'])
@token_required
def protected_route(current_user):
    return jsonify({
        'message': 'This is a protected route',
        'user': current_user['username'],
        'role': current_user['role']
    })

@app.route('/api/admin', methods=['GET'])
@token_required
def admin_route(current_user):
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Permission denied: Admin access required!'}), 403
    
    return jsonify({
        'message': 'This is an admin route',
        'user': current_user['username']
    })

# Optional: Refresh token endpoint
@app.route('/api/refresh', methods=['POST'])
@token_required
def refresh_token(current_user):
    # Generate a new token with a new expiration time
    token = jwt.encode({
        'username': current_user['username'],
        'role': current_user['role'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    }, app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({'token': token})

if __name__ == '__main__':
    app.run(debug=True)