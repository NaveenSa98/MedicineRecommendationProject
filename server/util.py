from typing import Dict, List
import pandas as pd
import numpy as np
import pickle 

class MedicineRecommendationSystem:
    def __init__(self):
        # Load data files
        self.df_desc = pd.read_csv('../data/description.csv')
        self.df_sym = pd.read_csv('../data/symtoms_df.csv')
        self.df_dit = pd.read_csv('../data/diets.csv')
        self.df_med = pd.read_csv('../data/medications.csv')
        self.df_prec = pd.read_csv('../data/precautions_df.csv')
        self.df_symt = pd.read_csv('../data/symptom-severity.csv')
        self.df_work = pd.read_csv('../data/workout_df.csv')

        # Create symptoms dictionary
        self.symptoms_dict = {'itching': 0, 'skin_rash': 1, 'nodal_skin_eruptions': 2, 'continuous_sneezing': 3, 'shivering': 4, 'chills': 5, 'joint_pain': 6, 'stomach_pain': 7, 'acidity': 8, 'ulcers_on_tongue': 9, 'muscle_wasting': 10, 'vomiting': 11, 'burning_micturition': 12, 'spotting_urination': 13, 'fatigue': 14, 'weight_gain': 15, 'anxiety': 16, 'cold_hands_and_feets': 17, 'mood_swings': 18, 'weight_loss': 19, 'restlessness': 20, 'lethargy': 21, 'patches_in_throat': 22, 'irregular_sugar_level': 23, 'cough': 24, 'high_fever': 25, 'sunken_eyes': 26, 'breathlessness': 27, 'sweating': 28, 'dehydration': 29, 'indigestion': 30, 'headache': 31, 'yellowish_skin': 32, 'dark_urine': 33, 'nausea': 34, 'loss_of_appetite': 35, 'pain_behind_the_eyes': 36, 'back_pain': 37, 'constipation': 38, 'abdominal_pain': 39, 'diarrhoea': 40, 'mild_fever': 41, 'yellow_urine': 42, 'yellowing_of_eyes': 43, 'acute_liver_failure': 44, 'fluid_overload': 117, 'swelling_of_stomach': 46, 'swelled_lymph_nodes': 47, 'malaise': 48, 'blurred_and_distorted_vision': 49, 'phlegm': 50, 'throat_irritation': 51, 'redness_of_eyes': 52, 'sinus_pressure': 53, 'runny_nose': 54, 'congestion': 55, 'chest_pain': 56, 'weakness_in_limbs': 57, 'fast_heart_rate': 58, 'pain_during_bowel_movements': 59, 'pain_in_anal_region': 60, 'bloody_stool': 61, 'irritation_in_anus': 62, 'neck_pain': 63, 'dizziness': 64, 'cramps': 65, 'bruising': 66, 'obesity': 67, 'swollen_legs': 68, 'swollen_blood_vessels': 69, 'puffy_face_and_eyes': 70, 'enlarged_thyroid': 71, 'brittle_nails': 72, 'swollen_extremeties': 73, 'excessive_hunger': 74, 'extra_marital_contacts': 75, 'drying_and_tingling_lips': 76, 'slurred_speech': 77, 'knee_pain': 78, 'hip_joint_pain': 79, 'muscle_weakness': 80, 'stiff_neck': 81, 'swelling_joints': 82, 'movement_stiffness': 83, 'spinning_movements': 84, 'loss_of_balance': 85, 'unsteadiness': 86, 'weakness_of_one_body_side': 87, 'loss_of_smell': 88, 'bladder_discomfort': 89, 'foul_smell_ofurine': 90, 'continuous_feel_of_urine': 91, 'passage_of_gases': 92, 'internal_itching': 93, 'toxic_look_(typhos)': 94, 'depression': 95, 'irritability': 96, 'muscle_pain': 97, 'altered_sensorium': 98, 'red_spots_over_body': 99, 'belly_pain': 100, 'abnormal_menstruation': 101, 'dischromic_patches': 102, 'watering_from_eyes': 103, 'increased_appetite': 104, 'polyuria': 105, 'family_history': 106, 'mucoid_sputum': 107, 'rusty_sputum': 108, 'lack_of_concentration': 109, 'visual_disturbances': 110, 'receiving_blood_transfusion': 111, 'receiving_unsterile_injections': 112, 'coma': 113, 'stomach_bleeding': 114, 'distention_of_abdomen': 115, 'history_of_alcohol_consumption': 116, 'blood_in_sputum': 118, 'prominent_veins_on_calf': 119, 'palpitations': 120, 'painful_walking': 121, 'pus_filled_pimples': 122, 'blackheads': 123, 'scurring': 124, 'skin_peeling': 125, 'silver_like_dusting': 126, 'small_dents_in_nails': 127, 'inflammatory_nails': 128, 'blister': 129, 'red_sore_around_nose': 130, 'yellow_crust_ooze': 131, 'prognosis': 132}
             
        # Diseases mapping
        self.diseases_list = {
            15: 'Fungal infection', 4: 'Allergy', 16: 'GERD', 9: 'Chronic cholestasis', 
            14: 'Drug Reaction', 33: 'Peptic ulcer diseae', 1: 'AIDS', 12: 'Diabetes', 
            17: 'Gastroenteritis', 6: 'Bronchial Asthma', 23: 'Hypertension', 
            30: 'Migraine', 7: 'Cervical spondylosis', 32: 'Paralysis (brain hemorrhage)', 
            28: 'Jaundice', 29: 'Malaria', 8: 'Chicken pox', 11: 'Dengue', 
            37: 'Typhoid', 40: 'hepatitis A', 19: 'Hepatitis B', 20: 'Hepatitis C', 
            21: 'Hepatitis D', 22: 'Hepatitis E', 3: 'Alcoholic hepatitis', 
            36: 'Tuberculosis', 10: 'Common Cold', 34: 'Pneumonia', 
            13: 'Dimorphic hemmorhoids(piles)', 18: 'Heart attack', 39: 'Varicose veins', 
            26: 'Hypothyroidism', 24: 'Hyperthyroidism', 25: 'Hypoglycemia', 
            31: 'Osteoarthristis', 5: 'Arthritis', 0: '(vertigo) Paroymsal Positional Vertigo', 
            2: 'Acne', 38: 'Urinary tract infection', 35: 'Psoriasis', 27: 'Impetigo'
        }

        # Load pre-trained SVM model
        try:
            with open('../notebook/svc.pkl', 'rb') as model_file:
                self.svc = pickle.load(model_file)
        except FileNotFoundError:
            raise FileNotFoundError("Model file 'sv.pkl' not found in the data directory")
        except Exception as e:
            raise RuntimeError(f"Error loading model: {e}")

    def get_symptoms(self) -> List[str]:
        """Return available symptoms"""
        return list(self.symptoms_dict.keys())
    
    

    def predict_disease(self, patient_symptoms: List[str]) -> Dict[str, any]:
        """Predict disease based on symptoms"""
        # Validate input symptoms
        invalid_symptoms = [sym for sym in patient_symptoms if sym.lower().replace(' ', '_') not in self.symptoms_dict]
        if invalid_symptoms:
            raise ValueError(f"Invalid symptoms: {', '.join(invalid_symptoms)}")

        # Create input vector
        input_vector = np.zeros(len(self.symptoms_dict))
        for item in patient_symptoms:
            symptom = item.lower().replace(' ', '_')
            if symptom in self.symptoms_dict:
                input_vector[self.symptoms_dict[symptom]] = 1

        # Predict disease
        try:
            predicted_disease_idx = self.svc.predict([input_vector])[0]
            predicted_disease = self.diseases_list[predicted_disease_idx]
        except Exception as e:
            raise ValueError(f"Error predicting disease: {e}")

        # Fetch additional information
        description = self.get_description(predicted_disease)
        precautions = self.get_precautions(predicted_disease)
        medicines = self.get_medicines(predicted_disease)
        diets = self.get_diets(predicted_disease)
        workouts = self.get_workouts(predicted_disease)

        return {
            'disease': predicted_disease,
            'description': description,
            'precautions': precautions,
            'medicines': medicines,
            'diets': diets,
            'workouts': workouts
        }

    def get_description(self, disease: str) -> str:
        """Get disease description"""
        desc = self.df_desc[self.df_desc['Disease'] == disease]['Description']
        return desc.values[0] if len(desc) > 0 else "No description available"

    def get_precautions(self, disease: str) -> List[str]:
        """Get disease precautions"""
        prec = self.df_prec[self.df_prec['Disease'] == disease][['Precaution_1', 'Precaution_2', 'Precaution_3', 'Precaution_4']]
        return [col for col in prec.values[0] if pd.notnull(col)]

    def get_medicines(self, disease: str) -> List[str]:
        """Get recommended medicines"""
        med = self.df_med[self.df_med['Disease'] == disease][['Medication']]
        return [m[0] for m in med.values if pd.notnull(m[0])]

    def get_diets(self, disease: str) -> List[str]:
        """Get recommended diets"""
        dit = self.df_dit[self.df_dit['Disease'] == disease]['Diet']
        return [d for d in dit.values if pd.notnull(d)]

    def get_workouts(self, disease: str) -> List[str]:
        """Get recommended workouts"""
        wrkout = self.df_work[self.df_work['disease'] == disease]['workout']
        return [w for w in wrkout.values if pd.notnull(w)]