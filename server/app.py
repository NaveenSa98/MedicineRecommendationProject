from flask import Flask, request, jsonify
from flask_cors import CORS
from util import MedicineRecommendationSystem

app = Flask(__name__)
CORS(app)  


# Initialize the recommendation system
recommendation_system = MedicineRecommendationSystem()

@app.route('/symptoms', methods=['GET'])
def get_symptoms():
    """Endpoint to get all available symptoms"""
    try:
        symptoms = recommendation_system.get_symptoms()
        return jsonify({'symptoms': symptoms}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    

@app.route('/predict', methods=['POST'])
def predict_disease():
    """Endpoint to predict disease based on symptoms"""
    try:
        # Get symptoms from request
        data = request.get_json()
        patient_symptoms = data.get('symptoms', [])

        # Validate input
        if not patient_symptoms:
            return jsonify({'error': 'No symptoms provided'}), 400

        # Predict disease and get recommendations
        result = recommendation_system.predict_disease(patient_symptoms)
        return jsonify(result), 200
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True,port=5000)
