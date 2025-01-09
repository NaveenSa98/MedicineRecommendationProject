import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const Header = () => (
  <header className="bg-blue-900/95 backdrop-blur-md shadow-lg">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
      <div className="flex items-center space-x-5 flex-grow-0">
        <img
          src="https://img.freepik.com/premium-vector/m-letter-gradient-abstract-vector-3d-logo-design-colorful-typography_624194-274.jpg?w=740"
          alt="MediGuide Logo"
          className="w-10 h-10 rounded-full"
        />
        <Link to="/" className="text-2xl font-bold text-white">MediGuide</Link>
        </div>
      </div>
    </div>
  </header>
);

const ResultCard = ({ title, content }) => (
  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
    <h3 className="text-xl font-semibold text-blue-300 mb-4">{title}</h3>
    <div className="text-gray-300 leading-relaxed">
      {Array.isArray(content) ? (
        <ul className="list-disc list-inside space-y-2">
          {content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>{content}</p>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample symptoms list - replace with your actual symptoms data
  const availableSymptoms = [
    "Fever", "Cough", "Headache", "Fatigue", "Sore throat",
    "Body aches", "Shortness of breath", "Nausea", "Dizziness"
  ];

  const filteredSymptoms = availableSymptoms.filter(
    symptom => symptom.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedSymptoms.includes(symptom)
  );

  const addSymptom = (symptom) => {
    if (selectedSymptoms.length < 5) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
      setSearchQuery('');
    }
  };

  const removeSymptom = (symptomToRemove) => {
    setSelectedSymptoms(selectedSymptoms.filter(symptom => symptom !== symptomToRemove));
  };

  const handleFindMedicine = () => {
    // Here you would typically make an API call to your ML model
    setShowResults(true);
  };

  // Sample prediction results - replace with actual data from your ML model
  const predictionResults = {
    medicine: ["Paracetamol 500mg", "Vitamin C 1000mg"],
    description: "Upper respiratory tract infection characterized by inflammation of the nasal passages and throat.",
    precautions: [
      "Rest adequately",
      "Stay hydrated",
      "Avoid cold exposure",
      "Monitor temperature"
    ],
    workouts: [
      "Light walking for 10-15 minutes",
      "Gentle stretching exercises",
      "Deep breathing exercises"
    ],
    diets: [
      "Warm soups and broths",
      "Citrus fruits high in Vitamin C",
      "Honey with warm water",
      "Light, easily digestible meals"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Enter Your Symptoms</h2>
          
          {/* Symptoms Input Section */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search symptoms..."
                className="w-full p-3 bg-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              {/* Dropdown for filtered symptoms */}
              {searchQuery && (
                <div className="absolute z-10 w-full mt-1 bg-blue-900/95 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredSymptoms.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => addSymptom(symptom)}
                      className="w-full text-left px-4 py-2 text-white hover:bg-blue-800/50 transition-colors"
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Symptoms Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedSymptoms.map((symptom) => (
              <div
                key={symptom}
                className="flex items-center gap-2 bg-blue-500/20 text-white px-3 py-1 rounded-full"
              >
                {symptom}
                <button
                  onClick={() => removeSymptom(symptom)}
                  className="hover:text-red-300 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Find Medicine Button */}
          <button
            onClick={handleFindMedicine}
            disabled={selectedSymptoms.length === 0}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300
              ${selectedSymptoms.length > 0
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transform hover:scale-[1.02]'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
          >
            Find Medicine
          </button>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResultCard title="Recommended Medicine" content={predictionResults.medicine} />
            <ResultCard title="Disease Description" content={predictionResults.description} />
            <ResultCard title="Precautions" content={predictionResults.precautions} />
            <ResultCard title="Recommended Workouts" content={predictionResults.workouts} />
            <ResultCard title="Dietary Recommendations" content={predictionResults.diets} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;