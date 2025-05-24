// Main module loader for German Learning Website
// This script dynamically loads module data files and initializes the application

// Global object to store all module data
const allModuleData = {
  menschen: {},
  mittelpunkt: {}
};

// Function to load a module script dynamically
function loadModuleScript(moduleNumber) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `module${moduleNumber}-data.js`;
    script.onload = () => {
      console.log(`Module ${moduleNumber} loaded successfully`);
      
      // Store the module data in the global object
      switch(moduleNumber) {
        case 1:
          allModuleData.menschen.modul1 = module1Data;
          break;
        case 2:
          allModuleData.menschen.modul2 = module2Data;
          break;
        case 3:
          allModuleData.menschen.modul3 = module3Data;
          break;
        case 4:
          allModuleData.menschen.modul4 = module4Data;
          break;
      }
      
      resolve();
    };
    script.onerror = () => {
      console.error(`Failed to load module ${moduleNumber}`);
      reject(new Error(`Failed to load module ${moduleNumber}`));
    };
    document.head.appendChild(script);
  });
}

// Function to load Mittelpunkt data
function loadMittelpunktData() {
  // Mittelpunkt data structure
  allModuleData.mittelpunkt = {
    "title": "Mittelpunkt B1+",
    "description": "German language course for advanced B1 level learners",
    "lektion1": {
      "title": "Ankommen/Neu sein",
      "description": "Getting started in a new environment",
      "units": {
        "A": {
          "title": "Erste Begegnungen",
          "introduction": "Willkommen zu Lektion 1: Ankommen/Neu sein! In dieser Einheit lernen wir, wie man sich vorstellt und erste Kontakte knüpft.",
          "vocabulary": [
            {"word": "die Begegnung", "translation": "encounter, meeting"},
            {"word": "sich vorstellen", "translation": "to introduce oneself"},
            {"word": "der Kontakt", "translation": "contact"},
            {"word": "kennenlernen", "translation": "to get to know"},
            {"word": "die Begrüßung", "translation": "greeting"}
          ],
          "grammar": {
            "title": "Satzbau: Wiederholung",
            "explanation": "Im Deutschen steht das Verb immer an zweiter Stelle im Hauptsatz.",
            "examples": [
              "Ich heiße Maria.",
              "Heute gehe ich ins Kino.",
              "Am Wochenende besuche ich meine Freunde."
            ]
          },
          "questions": [
            {
              "question": "Wie stellt man sich auf Deutsch vor?",
              "correctAnswer": "Man sagt: 'Hallo, ich heiße [Name]' oder 'Guten Tag, mein Name ist [Name]'.",
              "explanation": "Bei der Vorstellung verwendet man typischerweise diese Formulierungen."
            },
            {
              "question": "Ergänzen Sie den Satz: 'Morgen ___ ich einen neuen Kurs.'",
              "correctAnswer": "besuche",
              "explanation": "Das Verb 'besuchen' steht in der zweiten Position im Satz."
            }
          ],
          "conclusion": "Sehr gut! Sie haben gelernt, wie man sich auf Deutsch vorstellt und den deutschen Satzbau wiederholt."
        },
        "B": {
          "title": "Wohnen und Leben",
          "introduction": "In dieser Einheit lernen wir über Wohnsituationen und wie man über seinen Wohnort spricht.",
          "vocabulary": [
            {"word": "die Wohnung", "translation": "apartment"},
            {"word": "das Zimmer", "translation": "room"},
            {"word": "die Miete", "translation": "rent"},
            {"word": "der Nachbar / die Nachbarin", "translation": "neighbor"},
            {"word": "einziehen", "translation": "to move in"}
          ],
          "grammar": {
            "title": "Präpositionen mit Dativ und Akkusativ",
            "explanation": "Einige Präpositionen können entweder mit Dativ (Wo?) oder Akkusativ (Wohin?) verwendet werden.",
            "examples": [
              "Ich stelle die Lampe auf den Tisch. (Akkusativ - Wohin?)",
              "Die Lampe steht auf dem Tisch. (Dativ - Wo?)"
            ]
          },
          "questions": [
            {
              "question": "Wo wohnen Sie? Beschreiben Sie Ihre Wohnung oder Ihr Haus.",
              "correctAnswer": "Eine typische Antwort könnte sein: 'Ich wohne in einer Wohnung im zweiten Stock. Sie hat zwei Zimmer, eine Küche und ein Bad.'",
              "explanation": "Bei der Beschreibung einer Wohnung nennt man typischerweise die Lage, Größe und Räume."
            },
            {
              "question": "Ergänzen Sie: 'Ich hänge das Bild ___ ___ Wand.' (Wohin?)",
              "correctAnswer": "an die",
              "explanation": "Bei Bewegung (Wohin?) verwendet man den Akkusativ: 'an die Wand'."
            }
          ],
          "conclusion": "Gut gemacht! Sie können jetzt über Wohnsituationen sprechen und Präpositionen mit Dativ und Akkusativ korrekt verwenden."
        }
      }
    }
  };
}

// Initialize the application by loading all modules
async function initializeApp() {
  try {
    // Show loading indicator
    document.getElementById('loading-indicator').style.display = 'block';
    
    // Load all Menschen B1 modules in parallel
    await Promise.all([
      loadModuleScript(1),
      loadModuleScript(2),
      loadModuleScript(3),
      loadModuleScript(4)
    ]);
    
    // Load Mittelpunkt data
    loadMittelpunktData();
    
    // Prepare the combined lesson data structure
    const lessonData = {
      "menschen": {
        "title": "Menschen B1",
        "description": "German language course for B1 level learners",
        "modules": {
          "modul1": allModuleData.menschen.modul1.units,
          "modul2": allModuleData.menschen.modul2.units,
          "modul3": allModuleData.menschen.modul3.units,
          "modul4": allModuleData.menschen.modul4.units
        },
        "completed": false
      },
      "mittelpunkt": allModuleData.mittelpunkt
    };
    
    // Initialize chatbot with the combined lesson data
    window.chatbot = new Chatbot(lessonData);
    window.chatbot.init();
    
    // Update module list based on current book
    updateModuleList();
    
    // Update progress indicators
    window.chatbot.updateProgress();
    
    // Hide loading indicator
    document.getElementById('loading-indicator').style.display = 'none';
    
    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    document.getElementById('loading-indicator').textContent = 'Failed to load modules. Please refresh the page.';
  }
}

// Function to update module list based on current book
function updateModuleList() {
  const moduleList = document.getElementById('module-list');
  moduleList.innerHTML = '';
  
  if (window.chatbot.currentBook === 'menschen') {
    // Populate with modules from Menschen
    const modules = {
      "modul1": { title: "Modul 1: Aussehen und Persönlichkeit" },
      "modul2": { title: "Modul 2: Kommunikation und Technik" },
      "modul3": { title: "Modul 3: Reisen und Mobilität" },
      "modul4": { title: "Modul 4: Kultur und Geschichte" }
    };
    
    Object.keys(modules).forEach(moduleKey => {
      const module = modules[moduleKey];
      const li = document.createElement('li');
      li.textContent = module.title;
      
      if (moduleKey === window.chatbot.currentModule) {
        li.classList.add('active');
      }
      
      li.addEventListener('click', function() {
        if (window.chatbot.changeModule(moduleKey)) {
          updateModuleList();
          window.chatbot.updateProgress();
        }
      });
      
      moduleList.appendChild(li);
    });
  } else {
    // Populate with lektionen from Mittelpunkt
    Object.keys(allModuleData.mittelpunkt).filter(key => 
      key !== 'title' && key !== 'description' && key !== 'completed').forEach(lektionKey => {
      const lektion = allModuleData.mittelpunkt[lektionKey];
      const li = document.createElement('li');
      li.textContent = lektion.title;
      
      if (lektionKey === window.chatbot.currentLektion) {
        li.classList.add('active');
      }
      
      li.addEventListener('click', function() {
        if (window.chatbot.changeLektion(lektionKey)) {
          updateModuleList();
          window.chatbot.updateProgress();
        }
      });
      
      moduleList.appendChild(li);
    });
  }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the application
  initializeApp();
  
  // Event listener for send button
  document.getElementById('send-btn').addEventListener('click', function() {
    sendMessage();
  });
  
  // Event listener for Enter key in input field
  document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Event listener for previous button
  document.getElementById('prev-btn').addEventListener('click', function() {
    if (window.chatbot.prevUnit()) {
      updateModuleList();
      window.chatbot.updateProgress();
    }
  });
  
  // Event listener for next button
  document.getElementById('next-btn').addEventListener('click', function() {
    if (window.chatbot.nextUnit()) {
      updateModuleList();
      window.chatbot.updateProgress();
    }
  });
  
  // Event listener for unit indicators
  document.querySelectorAll('.unit-indicator').forEach(indicator => {
    indicator.addEventListener('click', function() {
      const unit = this.getAttribute('data-unit');
      if (window.chatbot.changeUnit(unit)) {
        updateModuleList();
        window.chatbot.updateProgress();
      }
    });
  });
  
  // Event listener for book selector
  document.querySelectorAll('.book-option').forEach(option => {
    option.addEventListener('click', function() {
      const book = this.getAttribute('data-book');
      
      // Check if Mittelpunkt is unlocked
      if (book === 'mittelpunkt' && !localStorage.getItem('menschenCompleted')) {
        window.chatbot.sendBotMessage("Sie müssen zuerst den Menschen B1 Kurs abschließen, bevor Sie mit Mittelpunkt B1+ beginnen können.");
        return;
      }
      
      // Update active class
      document.querySelectorAll('.book-option').forEach(opt => {
        opt.classList.remove('active');
      });
      this.classList.add('active');
      
      // Change book in chatbot
      if (window.chatbot.changeBook(book)) {
        updateModuleList();
        window.chatbot.updateProgress();
      }
    });
  });
  
  // Event listener for teacher selection
  document.getElementById('frau-schmidt').addEventListener('click', function() {
    document.getElementById('herr-schmidt').classList.remove('active');
    this.classList.add('active');
    window.chatbot.changeTeacher('female');
  });
  
  document.getElementById('herr-schmidt').addEventListener('click', function() {
    document.getElementById('frau-schmidt').classList.remove('active');
    this.classList.add('active');
    window.chatbot.changeTeacher('male');
  });
  
  // Event listener for dark mode toggle
  document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    this.classList.toggle('active');
  });
  
  // Function to send user message
  function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (message) {
      window.chatbot.handleUserMessage(message);
      userInput.value = '';
    }
  }
  
  // Check if Menschen is completed (for initial load)
  if (localStorage.getItem('menschenCompleted')) {
    allModuleData.menschen.completed = true;
    document.querySelectorAll('.book-option').forEach(option => {
      if (option.getAttribute('data-book') === 'mittelpunkt') {
        option.classList.remove('disabled');
        option.removeAttribute('title');
      }
    });
  } else {
    // Disable Mittelpunkt option if Menschen not completed
    document.querySelectorAll('.book-option').forEach(option => {
      if (option.getAttribute('data-book') === 'mittelpunkt') {
        option.classList.add('disabled');
        option.setAttribute('title', 'Schließen Sie zuerst Menschen B1 ab');
      }
    });
  }
});
