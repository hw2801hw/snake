from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data['username']
    password = data['password']
    # Save the user information to a file or database
    with open('users.txt', 'a') as f:
        f.write(f"{username},{password}\n")
    return jsonify({'message': 'User registered successfully'})

@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    username = data['username']
    password = data['password']
    # Check if the user exists in the file or database
    with open('users.txt', 'r') as f:
        for line in f:
            user, pw = line.strip().split(',')
            if user == username and pw == password:
                return jsonify({'message': 'Login successful', 'username': user})
    return jsonify({'message': 'Invalid username or password'}), 401

if __name__ == '__main__':
    app.run(debug=True)
