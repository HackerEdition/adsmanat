from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Cross-Origin Resource Sharing (JS ilə işləmək üçün)

// MySQL konfiqurasiyası
db_config = {
    'host': 'sql8.freesqldatabase.com',
    'user': 'sql8780594',
    'password': 's3Alaib8pR',
    'database': 'sql8780594',
    'port': 3306
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

@app.route('/get_user_data', methods=['GET'])
def get_user_data():
    user_id = request.args.get('id', type=int)
    if not user_id:
        return jsonify({'error': 'No user id provided'}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT ad_views, coin_balance FROM users WHERE id = %s', (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        return jsonify(user)
    else:
        return jsonify({'ad_views': 0, 'coin_balance': 0})

@app.route('/update_user_data', methods=['POST'])
def update_user_data():
    data = request.get_json()

    if not data or 'id' not in data:
        return jsonify({'error': 'Invalid input'}), 400

    user_id = data['id']
    username = data.get('username', '')
    ad_views = data.get('ad_views', 0)
    coin_balance = data.get('coin_balance', 0)

    conn = get_db_connection()
    cursor = conn.cursor()

    sql = '''
    INSERT INTO users (id, telegram_username, ad_views, coin_balance)
    VALUES (%s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE 
        telegram_username=VALUES(telegram_username),
        ad_views=VALUES(ad_views),
        coin_balance=VALUES(coin_balance)
    '''

    cursor.execute(sql, (user_id, username, ad_views, coin_balance))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
