import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import axios from 'axios';

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
            <li key={index}>{
              // Remove any square brackets if present
              typeof item === 'string' 
                ? item.replace(/^\[|\]$/g, '').replace(/'/g, '')
                : item
            }</li>
          ))}
        </ul>
      ) : (
        <p>{content}</p>
      )}
    </div>
  </div>
);


const Dashboard = () => {
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [predictionResults, setPredictionResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/symptoms');
        setAvailableSymptoms(response.data.symptoms);
      } catch (err) {
        console.error('Error fetching symptoms:', err);
        setError('Failed to load symptoms. Please try again later.');
      }
    };

    fetchSymptoms();
  }, []);

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

  const handleFindMedicine = async () => {
    if (selectedSymptoms.length === 0) return;

    setIsLoading(true);
    setError(null);
    setShowResults(false); 

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', {
        symptoms: selectedSymptoms
      });

      console.log('Prediction Results:', response.data); 
      setPredictionResults(response.data);
      setShowResults(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Error predicting disease:', err);
      setError('Failed to process symptoms. Please try again.');
      setIsLoading(false);
    }
  };

  const generatePDF = () => {
    try {
      // Ensure prediction results exist
      if (!predictionResults) {
        console.error('No prediction results to generate PDF');
        return;
      }
  
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      let yPosition = 20;
      
      // Safely access prediction results with fallbacks
      const disease = predictionResults.disease || 'Not Available';
      const description = predictionResults.description || 'No description available';
      const medicines = predictionResults.medicine || [];
      const precautions = predictionResults.precautions || [];
      const workouts = predictionResults.workouts || [];
      const diets = predictionResults.diets || [];
      
      // Add header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Medical Prescription', pageWidth / 2, yPosition, { align: 'center' });
      
      // Add date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      yPosition += 10;
      const currentDate = new Date().toLocaleDateString();
      doc.text(`Date: ${currentDate}`, 20, yPosition);
      
      // Add symptoms
      yPosition += 10;
      doc.setFont('helvetica', 'bold');
      doc.text('Symptoms:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition += 7;
      selectedSymptoms.forEach(symptom => {
        doc.text(`• ${symptom}`, 25, yPosition);
        yPosition += 7;
      });
      
      // Add diagnosis
      yPosition += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Diagnosis:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition += 7;
      const wrappedDescription = doc.splitTextToSize(description, pageWidth - 40);
      doc.text(wrappedDescription, 25, yPosition);
      yPosition += wrappedDescription.length * 7 + 5;
      
      // Add medications (with error handling)
      doc.setFont('helvetica', 'bold');
      doc.text('Prescribed Medications:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition += 7;
      if (medicines.length > 0) {
        medicines.forEach(med => {
          doc.text(`• ${med}`, 25, yPosition);
          yPosition += 7;
        });
      } else {
        doc.text('No medications prescribed', 25, yPosition);
        yPosition += 7;
      }
      
      // Add precautions (with error handling)
      yPosition += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Precautions:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition += 7;
      if (precautions.length > 0) {
        precautions.forEach(precaution => {
          doc.text(`• ${precaution}`, 25, yPosition);
          yPosition += 7;
        });
      } else {
        doc.text('No specific precautions noted', 25, yPosition);
        yPosition += 7;
      }
      
      // Add lifestyle recommendations
      yPosition += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Lifestyle Recommendations:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      
      // Workouts
      yPosition += 7;
      doc.text('Exercise:', 25, yPosition);
      yPosition += 7;
      if (workouts.length > 0) {
        workouts.forEach(workout => {
          doc.text(`• ${workout}`, 30, yPosition);
          yPosition += 7;
        });
      } else {
        doc.text('No specific exercise recommendations', 30, yPosition);
        yPosition += 7;
      }
      
      // Diet
      yPosition += 5;
      doc.text('Diet:', 25, yPosition);
      yPosition += 7;
      if (diets.length > 0) {
        diets.forEach(diet => {
          doc.text(`• ${diet}`, 30, yPosition);
          yPosition += 7;
        });
      } else {
        doc.text('No specific diet recommendations', 30, yPosition);
        yPosition += 7;
      }
      
      // Add disclaimer
      yPosition += 15;
      doc.setFontSize(8);
      doc.setTextColor(128);
      const disclaimer = 'This is an AI-generated prescription from MediGuide. Please consult with a healthcare professional before following any recommendations.';
      const wrappedDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - 40);
      doc.text(wrappedDisclaimer, 20, yPosition);
      
      // Save the PDF
      doc.save('medical_prescription.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate prescription. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Enter Your Symptoms</h2>

          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search symptoms..."
                className="w-full p-3 bg-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

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

          <button
            onClick={handleFindMedicine}
            disabled={selectedSymptoms.length === 0 || isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300
              ${selectedSymptoms.length > 0
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transform hover:scale-[1.02]'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
          >
            {isLoading ? 'processing..' : 'Find Medicine' }
          </button>
        </div>

        {showResults && predictionResults && (
          <>
            <div className="backdrop-blur-md p-6 mb-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold text-yellow-300">Health Insights</h2>
                <button
                  onClick={generatePDF}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Download size={20} />
                  Download Prescription
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResultCard title="Disease" content={predictionResults.disease} />
              <ResultCard title="Disease Description" content={predictionResults.description} />
              <ResultCard title="Recommended Medicine" content={predictionResults.medicines} />
              <ResultCard title="Precautions" content={predictionResults.precautions} />
              <ResultCard title="Recommended Workouts" content={predictionResults.workouts} />
              <ResultCard title="Dietary Recommendations" content={predictionResults.diets} />
            </div>
          </>
        )}
      </main>
    </div>
  );
  
};

export default Dashboard;