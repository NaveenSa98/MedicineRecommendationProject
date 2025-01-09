import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = element.offsetTop - 64; // Account for fixed header height
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="fixed top-0 w-full bg-gradient-to-br from-blue-700 to-purple-900 backdrop-blur-md z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-5 flex-grow-0">
            <img 
              src="https://img.freepik.com/premium-vector/m-letter-gradient-abstract-vector-3d-logo-design-colorful-typography_624194-274.jpg?w=740"
              alt="MediGuide Logo" 
              className="w-10 h-10 rounded-full"
            />
            <span className="text-2xl font-bold text-white">MediGuide</span>
          </div>
          <nav className="flex space-x-8">
            {['home', 'features', 'about'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="text-white hover:text-blue-300 transition-colors duration-300 capitalize px-3 py-2"
              >
                {section}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

const FeatureCard = ({ title, description, imageUrl, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`feature-${index}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [index]);

  return (
    <div
      id={`feature-${index}`}
      className={`bg-white/10 backdrop-blur-md rounded-xl p-6 transform transition duration-300 transform hover:scale-110
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
    >
      <div className="flex justify-center mb-6">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-16 h-16 object-cover rounded-lg"
        />
      </div>
      <h3 className="text-xl font-semibold text-blue-300 mb-4 text-center">{title}</h3>
      <p className="text-gray-300 leading-relaxed text-center">{description}</p>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleSections, setVisibleSections] = useState({
    home: false,
    features: false,
    about: false
  });

  useEffect(() => {
    setIsLoaded(true);

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.2
    });

    ['home', 'features', 'about'].forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      title: "AI-powered Diagnosis",
      description: "Advanced ML algorithms analyze your symptoms with high accuracy, providing reliable medical insights based on comprehensive medical data analysis.",
      imageUrl: "https://img.freepik.com/free-vector/natural-language-processing-illustration_23-2149221118.jpg?t=st=1736442265~exp=1736445865~hmac=1f67161b8d7ac77f1c795cbb04852987e049eaf4ed0b1b230820e6f30d361162&w=996"
    },
    {
      title: "Personalized Medicine",
      description: "Tailored medicine recommendations considering your specific symptoms, medical history, and individual health factors for optimal treatment outcomes.",
      imageUrl: "https://img.freepik.com/free-vector/young-doctor-white-coat-with-medical-capsule-patient_24797-2795.jpg?t=st=1736442360~exp=1736445960~hmac=f235a85902faaaa40eb379e81bdabbe3a245e6bb7879443cef0f01c0d01bef86&w=826"
    },
    {
      title: "Comprehensive Health Insight",
      description: "Detailed information about conditions, including symptoms, preventive measures, recommended lifestyle changes, and dietary guidelines.",
      imageUrl: "https://img.freepik.com/free-vector/online-doctor-concept_23-2148512245.jpg?t=st=1736442504~exp=1736446104~hmac=d0f2dfa23ff5643c97671b829e5fa391370aa6d51ae0eaaab1bb177f523e6b35&w=996"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      <Header />
      
      <section id="home" className={`min-h-screen flex items-center justify-center pt-16 transition-all duration-1000 
        ${visibleSections.home ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Welcome to MediGuide
            </h1>
            <p className="text-xl text-gray-300 mb-12">
              Your AI-Powered Medicine Recommendation System
            </p>
            <button
              onClick={() => navigate('/Dashboard')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-110">
              Take Your Own Medicine
            </button>
          </div>
          <div className="flex justify-center">
            <img 
              src="https://img.freepik.com/free-photo/celebration-labour-day-with-3d-cartoon-portrait-working-woman_23-2151306547.jpg?t=st=1736442086~exp=1736445686~hmac=450ebdf23b1118a5caee008293b7daaa01652437422e17f91198075ecdee2b80&w=996"
              alt="Healthcare Illustration" 
              className="rounded-2xl shadow-2xl max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      <section id="features" className={`py-24 px-4 transition-all duration-1000 
        ${visibleSections.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
        <h2 className="text-4xl font-bold text-white text-center mb-16">Key Features</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              index={index}
              title={feature.title}
              description={feature.description}
              imageUrl={feature.imageUrl}
            />
          ))}
        </div>
      </section>

      <section id="about"className={`py-24 px-4 transition-all duration-1000 
        ${visibleSections.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-4xl font-bold text-white text-center mb-12">About MediGuide</h2>
            <p class="text-gray-300 mb-6">MediGuide is a cutting-edge health assistant that leverages the power of artificial intelligence to provide you with accurate, personalized health recommendations. Our mission is to make quality healthcare information accessible to everyone, anytime, anywhere.</p>
            <p class="text-gray-300">With MediGuide, you can input your symptoms and receive instant, AI-powered diagnoses and medicine recommendations. We also provide comprehensive health insights, including precautions, workout suggestions, and diet plans tailored to your condition.</p>
          </div>
          <div class="relative">
            <img src="https://img.freepik.com/free-vector/online-medical-assistance-illustration_74855-4447.jpg?t=st=1736442962~exp=1736446562~hmac=e6768948315e0003fca681871b0a17376e01210019f1afb6e0e5c5f539200464&w=826" alt="MediGuide App" class="rounded-lg shadow-xl"/>
            <div class="absolute -bottom-6 -right-6 bg-blue-500 text-white py-2 px-4 rounded-full">AI-Powered</div>
          </div>
        </div>
      </div>
    </section>

      <footer className="bg-gradient-to-br from-blue-900 to-purple-700 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-300">
          <p className="mb-2">© 2025 MediGuide. All rights reserved.</p>
          <p>Your trusted partner in health recommendations</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;