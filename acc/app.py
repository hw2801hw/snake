import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 設置 users.json 文件的路徑
users_file = 'users.json'

@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data['username']
    password = data['password']

    # 讀取 users.json 文件中的用戶列表
    if os.path.exists(users_file):
        with open(users_file, 'r') as f:
            users = json.load(f)
    else:
        users = {}

    # 檢查用戶是否已經註冊
    if username in users:
        return jsonify({'message': 'Username already exists'}), 400

    # 將新用戶信息添加到用戶列表中
    users[username] = password

    # 將更新後的用戶列表保存到 users.json 文件
    with open(users_file, 'w') as f:
        json.dump(users, f)

    return jsonify({'message': 'User registered successfully'})

@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    username = data['username']
    password = data['password']

    # 讀取 users.json 文件中的用戶列表
    if os.path.exists(users_file):
        with open(users_file, 'r') as f:
            users = json.load(f)
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

    # 檢查用戶是否存在且密碼是否正確
    if username in users and users[username] == password:
        return jsonify({'message': 'Login successful', 'username': username})
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

if __name__ == '__main__':
    app.run(debug=True)
