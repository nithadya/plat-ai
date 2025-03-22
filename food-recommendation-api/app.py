from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import DistilBertTokenizer, DistilBertModel
import torch
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
import os
import numpy as np
import json
from dotenv import load_dotenv
import logging
import re
import time

load_dotenv()
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

username = os.getenv("MONGO_USERNAME")
password = os.getenv("MONGO_PASSWORD")
cluster = os.getenv("MONGO_CLUSTER", "cluster0.3lbpg.mongodb.net")
db_name = os.getenv("MONGO_DB", "food-del")
collection_name = os.getenv("MONGO_COLLECTION", "foods")

try:
    uri = f"mongodb+srv://{username}:{password}@{cluster}/?retryWrites=true&w=majority"
    client = MongoClient(uri)
    db = client[db_name]
    menu_collection = db[collection_name]
    client.admin.command('ping')
    logger.info("Successfully connected to MongoDB")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {e}")
    logger.info("Using fallback sample data")

SAMPLE_FOOD_DATA = [
    {
        "name": "Grilled Chicken Salad",
        "description": "Fresh greens with grilled chicken breast, high in protein and low in carbs",
        "price": 12.99,
        "image": "https://example.com/grilled-chicken-salad.jpg",
        "category": "Salads",
        "carbs": 10,
        "protein": 25,
        "fats": 8,
        "calories": 320,
        "tags": ["high_protein", "low_carb", "gluten_free"],
        "dietary_flags": {
            "gluten_free": True,
            "low_carb": True,
            "high_protein": True,
            "vegan": False,
            "vegetarian": False,
            "dairy_free": True
        }
    },
    {
        "name": "Vegan Buddha Bowl",
        "description": "Plant-based bowl with quinoa, roasted vegetables, and tahini sauce.",
        "price": 14.99,
        "image": "https://example.com/vegan-buddha-bowl.jpg",
        "category": "Bowls",
        "carbs": 45,
        "protein": 12,
        "fats": 15,
        "calories": 450,
        "tags": ["vegan", "vegetarian", "plant_based"],
        "dietary_flags": {
            "gluten_free": True,
            "low_carb": False,
            "high_protein": False,
            "vegan": True,
            "vegetarian": True,
            "dairy_free": True
        }
    }
]

try:
    tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
    model = DistilBertModel.from_pretrained('distilbert-base-uncased')
    logger.info("Successfully loaded NLP models")
except Exception as e:
    logger.error(f"Failed to load NLP models: {e}")
    logger.info("Using simple keyword matching instead")

try:
    with open('dietary_responses.json', 'r') as f:
        DIETARY_RESPONSES = json.load(f)
    logger.info("Successfully loaded predefined responses")
except FileNotFoundError:
    logger.warning("Dietary responses file not found, creating default responses")
    DIETARY_RESPONSES = {
        "dietary_tips": {
            "high_protein": "Focus on lean meats, fish, eggs, and plant-based proteins.",
            "low_carb": "Focus on non-starchy vegetables, healthy fats, and lean proteins.",
            "low_fat": "Include healthy fats like avocado, olive oil, and nuts.",
            "gluten_free": "Focus on naturally gluten-free grains like rice and quinoa.",
            "vegan": "Ensure you get enough B12, iron, and protein from plant sources.",
            "vegetarian": "Include a variety of vegetables, grains, and plant proteins.",
            "dairy_free": "Replace dairy with plant-based milk alternatives."
        },
        "general_responses": {
            "greeting": "Hello! I'm your dietary assistant. How can I help you today?",
            "fallback": "I'm not sure I understand. Could you tell me more about your preferences?",
            "thank_you": "You're welcome! Feel free to ask if you need more recommendations."
        }
    }

food_cache = None
food_cache_timestamp = 0

def get_food_data(force_refresh=False):
    global food_cache, food_cache_timestamp
    current_time = int(time.time())
    if food_cache is None or force_refresh or (current_time - food_cache_timestamp > 3600):
        try:
            food_data = list(menu_collection.find())
            food_list = []
            for item in food_data:
                food_item = {
                    "food_id": str(item.get('_id')),
                    "food_name": item.get('name', ''),
                    "description": item.get('description', ''),
                    "price": float(item.get('price', 0)),
                    "image": item.get('image', ''),
                    "category": item.get('category', ''),
                    "carbs": float(item.get('carbs', 0)),
                    "protein": float(item.get('protein', 0)),
                    "fats": float(item.get('fats', 0)),
                    "calories": float(item.get('calories', 0)),
                    "tags": item.get('tags', []),
                    "dietary_flags": {
                        "gluten_free": bool(item.get('gluten_free', False)),
                        "low_carb": bool(item.get('low_carb', False)),
                        "high_protein": bool(item.get('high_protein', False)),
                        "vegan": bool(item.get('vegan', False)),
                        "vegetarian": bool(item.get('vegetarian', False)),
                        "dairy_free": bool(item.get('dairy_free', False))
                    }
                }
                food_list.append(food_item)
            if not food_list:
                logger.warning("No food data found in database, using sample data")
                food_list = SAMPLE_FOOD_DATA
            food_cache = food_list
            food_cache_timestamp = current_time
            logger.info(f"Food data cache refreshed, {len(food_list)} items loaded")
        except Exception as e:
            logger.error(f"Error fetching food data: {e}")
            if food_cache is None:
                logger.info("Using sample data due to database error")
                food_cache = SAMPLE_FOOD_DATA
                food_cache_timestamp = current_time
    return food_cache

def extract_dietary_preferences(message):
    message = message.lower()
    preferences = []
    dietary_keywords = {
        "high_protein": ["high protein", "protein rich", "more protein", "lots of protein"],
        "low_carb": ["low carb", "low-carb", "keto", "ketogenic", "less carbs"],
        "gluten_free": ["gluten free", "gluten-free", "no gluten", "celiac"],
        "vegan": ["vegan", "plant based", "no animal products"],
        "vegetarian": ["vegetarian", "no meat", "meatless"],
        "low_fat": ["low fat", "low-fat", "less fat"],
        "dairy_free": ["dairy free", "no dairy", "lactose free"]
    }
    for pref, keywords in dietary_keywords.items():
        if any(keyword in message for keyword in keywords):
            preferences.append(pref)
    negation_patterns = ["not", "don't", "avoid", "no"]
    for pref in list(preferences):
        for negation in negation_patterns:
            if f"{negation} {pref.replace('_', ' ')}" in message:
                preferences.remove(pref)
                break
    logger.info(f"Extracted preferences from '{message}': {preferences}")
    return preferences

def generate_dietary_tips(preferences):
    if not preferences:
        return "For a balanced diet, include a variety of nutrients. What are your needs?"
    tips = [DIETARY_RESPONSES["dietary_tips"].get(pref, "") for pref in preferences if pref in DIETARY_RESPONSES["dietary_tips"]]
    if not tips:
        return "I don't have specific advice, but we have many options. What are you looking for?"
    intro = f"Here's a tip for your {preferences[0].replace('_', ' ')} preference: " if len(preferences) == 1 else f"Based on your {', '.join(p.replace('_', ' ') for p in preferences)} preferences: "
    return intro + " ".join(tips)

# Updated: Require all preferences to match
def recommend_food(preferences, max_items=5):
    if not preferences:
        return {"message": "Please specify your dietary preferences.", "recommendations": []}
    
    food_data = get_food_data()
    matched_foods = []
    
    logger.info(f"Searching for foods matching all preferences: {preferences}")
    
    for food in food_data:
        all_match = True
        total_score = 0
        
        # Check if food matches ALL preferences
        for pref in preferences:
            pref_matched = False
            pref_text = pref.replace('_', ' ')
            description = food.get('description', '').lower()
            food_name = food.get('food_name', '').lower()
            
            # Check description, tags, dietary flags, and nutrition
            if pref_text in description or pref_text in food_name:
                pref_matched = True
                total_score += 40
            elif pref in food.get('tags', []):
                pref_matched = True
                total_score += 30
            elif food.get('dietary_flags', {}).get(pref, False):
                pref_matched = True
                total_score += 50
            elif pref == "high_protein" and food.get('protein', 0) > 20:
                pref_matched = True
                total_score += 45
            elif pref == "low_carb" and food.get('carbs', 0) < 10:
                pref_matched = True
                total_score += 45
            elif pref == "low_fat" and food.get('fats', 0) < 5:
                pref_matched = True
                total_score += 40
            
            if not pref_matched:
                all_match = False
                break
        
        if all_match:
            match_score = min(100, int((total_score / (len(preferences) * 50)) * 100))
            matched_foods.append((food, match_score))
    
    matched_foods.sort(key=lambda x: x[1], reverse=True)
    logger.info(f"Found {len(matched_foods)} foods matching all preferences")
    
    recommendations = [
        {
            "name": food['food_name'],
            "description": food['description'],
            "price": food['price'],
            "image": food['image'] if food['image'] else "/api/placeholder/400/320",
            "nutrition": {
                "carbs": food['carbs'],
                "protein": food['protein'],
                "fats": food['fats'],
                "calories": food['calories']
            },
            "match_score": score
        }
        for food, score in matched_foods[:max_items]
    ]
    
    if not recommendations:
        return {
            "message": f"No foods match all your {', '.join(pref.replace('_', ' ') for pref in preferences)} preferences. Try adjusting your criteria.",
            "recommendations": []
        }
    
    return {
        "message": f"Based on your {', '.join(pref.replace('_', ' ') for pref in preferences)} preferences, here are my recommendations:",
        "recommendations": recommendations
    }

def detect_intent(message):
    message = message.lower()
    intent_patterns = {
        "recommendation": [r"recommend", r"suggest", r"show me", r"find me", r"want", r"need"],
        "nutrition_info": [r"nutrition", r"calories", r"carbs", r"protein", r"fat"],
        "dietary_info": [r"diet", r"preference", r"restriction", r"allergy", r"avoid"],
        "greeting": [r"^hi\b", r"^hello\b", r"^hey\b"],
        "thank_you": [r"thank", r"thanks", r"appreciate"],
        "menu": [r"menu", r"what do you have", r"options"],
        "specific_food": [r"tell me about (.+)", r"what is (.+)", r"do you have (.+)"]
    }
    preferences = extract_dietary_preferences(message)
    if preferences:
        return "recommendation"
    for intent, patterns in intent_patterns.items():
        for pattern in patterns:
            if re.search(pattern, message):
                return intent
    return "general"

def handle_food_query(user_message):
    food_data = get_food_data()
    user_message_lower = user_message.lower()
    for food in food_data:
        food_name = food['food_name'].lower()
        if food_name in user_message_lower or re.search(f"\\b{re.escape(food_name)}\\b", user_message_lower):
            dietary_flags = [flag.replace('_', ' ') for flag, value in food.get('dietary_flags', {}).items() if value]
            response = f"{food['food_name']} is a {food['category']} dish. {food['description']} "
            response += f"It contains {food['carbs']}g carbs, {food['protein']}g protein, and {food['fats']}g fats"
            if dietary_flags:
                response += f". It is suitable for {', '.join(dietary_flags)} diets."
            return {
                "response": response,
                "food_item": {
                    "name": food['food_name'],
                    "description": food['description'],
                    "price": food['price'],
                    "image": food['image'] if food['image'] else "/api/placeholder/400/320",
                    "nutrition": {
                        "carbs": food['carbs'],
                        "protein": food['protein'],
                        "fats": food['fats'],
                        "calories": food['calories']
                    },
                    "match_score": 100
                }
            }
    return None

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request format"}), 400
        user_message = data.get('message', '')
        if not user_message:
            return jsonify({"response": "Please provide a message!"}), 400
        logger.info(f"Chat request: {user_message}")
        intent = detect_intent(user_message)
        preferences = extract_dietary_preferences(user_message)
        logger.info(f"Detected intent: {intent}, preferences: {preferences}")
        
        if intent == "greeting":
            return jsonify({"response": DIETARY_RESPONSES["general_responses"]["greeting"]})
        elif intent == "thank_you":
            return jsonify({"response": DIETARY_RESPONSES["general_responses"]["thank_you"]})
        elif intent == "recommendation" or preferences:
            recommendations = recommend_food(preferences)
            dietary_tips = generate_dietary_tips(preferences)
            if recommendations["recommendations"]:
                response = f"{recommendations['message']} {dietary_tips}"
                return jsonify({
                    "response": response,
                    "recommendations": recommendations["recommendations"]
                })
            else:
                return jsonify({
                    "response": f"No exact matches for your {', '.join(pref.replace('_', ' ') for pref in preferences)} preferences. {dietary_tips}"
                })
        elif intent == "specific_food":
            food_response = handle_food_query(user_message)
            if food_response:
                return jsonify({
                    "response": food_response["response"],
                    "recommendations": [food_response["food_item"]]
                })
        elif intent == "menu":
            food_data = get_food_data()
            sample_items = []
            categories_seen = set()
            for food in food_data[:4]:
                category = food.get('category', 'Other')
                if category not in categories_seen:
                    categories_seen.add(category)
                    sample_items.append({
                        "name": food['food_name'],
                        "description": food['description'],
                        "price": food['price'],
                        "image": food['image'] if food['image'] else "/api/placeholder/400/320",
                        "nutrition": {
                            "carbs": food['carbs'],
                            "protein": food['protein'],
                            "fats": food['fats'],
                            "calories": food['calories']
                        },
                        "match_score": 90
                    })
            return jsonify({
                "response": "Here are some menu items. Ask for recommendations based on preferences.",
                "recommendations": sample_items
            })
        return jsonify({
            "response": "I'm here to help with dietary needs. What food are you looking for?"
        })
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return jsonify({"error": "An internal error occurred."}), 500

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request format"}), 400
        dietary_plan = data.get('dietary_plan', '')
        if not dietary_plan:
            return jsonify({"error": "Dietary plan is required"}), 400
        logger.info(f"Recommendation request: {dietary_plan}")
        preferences = extract_dietary_preferences(dietary_plan)
        if not preferences:
            general_terms = {"protein": "high_protein", "carb": "low_carb", "fat": "low_fat", "gluten": "gluten_free", "vegan": "vegan", "vegetarian": "vegetarian", "dairy": "dairy_free"}
            for term, pref in general_terms.items():
                if term in dietary_plan.lower() and not ("high carb" in dietary_plan.lower() and term == "carb"):
                    preferences.append(pref)
            if not preferences:
                preferences = ["general"]
        logger.info(f"Processed preferences: {preferences}")
        recommendations_result = recommend_food(preferences)
        dietary_tips = generate_dietary_tips(preferences)
        response_text = "Here are general recommendations. Specify preferences for better suggestions." if preferences == ["general"] else f"Here are foods matching your {', '.join(pref.replace('_', ' ') for pref in preferences)} preferences. {dietary_tips}"
        return jsonify({
            "recommendations": recommendations_result["recommendations"],
            "dietary_tips": response_text
        })
    except Exception as e:
        logger.error(f"Error in recommend endpoint: {e}")
        return jsonify({"error": "An internal error occurred."}), 500

@app.route('/health', methods=['GET'])
def health_check():
    try:
        client.admin.command('ping')
        return jsonify({"status": "healthy", "message": "Service is running"}), 200
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({"status": "unhealthy", "message": str(e)}), 500

if __name__ == '__main__':
    get_food_data(force_refresh=True)
    app.run(debug=os.getenv("DEBUG", "False").lower() == "true", 
            host=os.getenv("HOST", "0.0.0.0"), 
            port=int(os.getenv("PORT", 5050)))