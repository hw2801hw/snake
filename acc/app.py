# app.py
from flask import Flask, request, jsonify
import json

app = Flask(__name__)

# 載入用戶數據
with open('users.json', 'r') as f:
    users = json.load(f)

@app.route('/')
def index():
    return app.send_static_file('app.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']
    
    # 檢查用戶名是否已被註冊
    if username in users:
        return jsonify({'error': '用戶名已被註冊'}), 400
    
    # 新增用戶
    users[username] = {'password': password}
    
    # 保存用戶數據到JSON文件
    with open('users.json', 'w') as f:
        json.dump(users, f)
    
    return jsonify({'message': '註冊成功'})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    
    # 檢查用戶是否存在
    if username not in users:
        return jsonify({'error': '用戶不存在'}), 400
    
    # 檢查密碼是否正確
    if users[username]['password'] != password:
        return jsonify({'error': '密碼錯誤'}), 400
    
    return jsonify({'message': '登入成功'})

if __name__ == '__main__':
    app.run(debug=True)
