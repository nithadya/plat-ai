from flask import Flask, request, jsonify
from flask_cors import CORS
from dietary_bot import DietaryConsultantBot

app = Flask(__name__)
CORS(app)  # Enable CORS
bot = DietaryConsultantBot()

@app.route('/chat', methods=['POST'])
def handle_chat():
    try:
        data = request.get_json()
        user_input = data.get('message', '')
        response = bot.process_user_input(user_input)
        return jsonify({
            'success': True,
            'response': response
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)