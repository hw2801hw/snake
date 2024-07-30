@app.route('/index', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        data = request.get_json()
        if 'username' in data and 'password' in data:
            username = data['username']
            password = data['password']
            
            # 檢查用戶是否已經存在
            with open('users.json', 'r') as f:
                users = json.load(f)
            if username in users:
                return jsonify({'error': '用戶名已被註冊'}), 400
            
            # 新增用戶
            users[username] = {'password': password}
            
            # 保存用戶數據到JSON文件
            with open('users.json', 'w') as f:
                json.dump(users, f)
            
            return jsonify({'message': '註冊成功'})
        else:
            # 檢查登錄信息
            username = data.get('username')
            password = data.get('password')
            
            # 檢查用戶是否存在
            with open('users.json', 'r') as f:
                users = json.load(f)
            if username not in users:
                return jsonify({'error': '用戶不存在'}), 400
            
            # 檢查密碼是否正確
            if users[username]['password'] != password:
                return jsonify({'error': '密碼錯誤'}), 400
            
            return jsonify({'message': '登入成功'})
    
    # 返回 index.html 文件
    return app.send_static_file('index.html')
