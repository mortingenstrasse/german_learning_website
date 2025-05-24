// Chatbot class to handle conversation flow and lesson progression
class Chatbot {
    constructor(lessonData) {
        this.lessonData = lessonData;
        this.currentBook = 'menschen';
        this.currentModule = 'modul1';
        this.currentUnit = 'A';
        this.currentLektion = 'lektion1';
        this.currentState = 'introduction';
        this.questionIndex = 0;
        this.teacher = 'female';
        this.messageHistory = [];
        this.chatContainer = document.getElementById('chat-messages');
    }

    init() {
        // Initialize the chatbot with a welcome message
        this.sendBotMessage(this.getWelcomeMessage());
        this.startCurrentUnit();
    }

    getWelcomeMessage() {
        const teacherName = this.teacher === 'female' ? 'Frau Schmidt' : 'Herr Schmidt';
        return `Hallo! Ich bin ${teacherName}, Ihr virtueller Deutschlehrer. Willkommen zum ${this.currentBook === 'menschen' ? 'Menschen B1' : 'Mittelpunkt B1+'} Kurs! Ich werde Sie durch die Lektionen führen und Ihnen helfen, Deutsch zu lernen. Lassen Sie uns beginnen!`;
    }

    startCurrentUnit() {
        // Get current unit data
        const unitData = this.getCurrentUnitData();
        if (!unitData) return;

        // Send introduction message
        this.sendBotMessage(unitData.introduction);
        
        // Display page numbers and lesson number if available
if (unitData.pageNumbers) {
    this.sendBotMessage(`Seiten: ${unitData.pageNumbers}`);
}
if (unitData.lessonNumber) {
    this.sendBotMessage(`${unitData.lessonNumber}`);
}

        // Move to reading state if there's a reading section
        if (unitData.reading) {
            this.currentState = 'reading';
            setTimeout(() => {
                this.sendBotMessage(`Lesen Sie bitte den folgenden Text: **${unitData.reading.title}**`);
                setTimeout(() => {
                    this.sendBotMessage(unitData.reading.text);
                    setTimeout(() => {
                        this.currentState = 'questions';
                        this.questionIndex = 0;
                        this.askNextQuestion();
                    }, 1000);
                }, 1000);
            }, 1000);
        } else {
            // Move directly to questions if no reading
            this.currentState = 'questions';
            this.questionIndex = 0;
            this.askNextQuestion();
        }
    }

    askNextQuestion() {
        const unitData = this.getCurrentUnitData();
        if (!unitData || !unitData.questions || this.questionIndex >= unitData.questions.length) {
            // No more questions, move to grammar
            this.currentState = 'grammar';
            this.teachGrammar();
            return;
        }

        const question = unitData.questions[this.questionIndex];
        this.sendBotMessage(question.question);
        // Wait for user response in handleUserMessage
    }

    teachGrammar() {
        const unitData = this.getCurrentUnitData();
        if (!unitData || !unitData.grammar) {
            // No grammar section, move to conclusion
            this.currentState = 'conclusion';
            this.concludeUnit();
            return;
        }

        const grammar = unitData.grammar;
        this.sendBotMessage(`Jetzt lernen wir etwas Grammatik: **${grammar.title}**`);
        setTimeout(() => {
            this.sendBotMessage(grammar.explanation);
            setTimeout(() => {
                let examples = "Hier sind einige Beispiele:\n\n";
                grammar.examples.forEach(example => {
                    examples += `- ${example}\n`;
                });
                this.sendBotMessage(examples);
                setTimeout(() => {
                    this.currentState = 'vocabulary';
                    this.teachVocabulary();
                }, 1000);
            }, 1000);
        }, 1000);
    }

    teachVocabulary() {
        const unitData = this.getCurrentUnitData();
        if (!unitData || !unitData.vocabulary || unitData.vocabulary.length === 0) {
            // No vocabulary section, move to conclusion
            this.currentState = 'conclusion';
            this.concludeUnit();
            return;
        }

        this.sendBotMessage("Hier sind einige wichtige Vokabeln aus dieser Einheit:");
        setTimeout(() => {
            let vocabulary = "";
            unitData.vocabulary.forEach(item => {
                vocabulary += `- **${item.word}**: ${item.translation}\n`;
            });
            this.sendBotMessage(vocabulary);
            setTimeout(() => {
                this.currentState = 'conclusion';
                this.concludeUnit();
            }, 1000);
        }, 1000);
    }

    concludeUnit() {
        const unitData = this.getCurrentUnitData();
        if (!unitData) return;

        if (unitData.conclusion) {
            this.sendBotMessage(unitData.conclusion);
        } else {
            this.sendBotMessage("Sehr gut! Sie haben diese Einheit abgeschlossen.");
        }

        setTimeout(() => {
            this.sendBotMessage("Sie können jetzt zur nächsten Einheit gehen oder diese Einheit wiederholen.");
            this.currentState = 'idle';
        }, 1000);
    }

    handleUserMessage(message) {
        // Add user message to chat
        this.addMessageToChat(message, 'user');

        // Handle based on current state
        switch (this.currentState) {
            case 'questions':
                this.handleQuestionResponse(message);
                break;
            case 'idle':
                this.handleIdleResponse(message);
                break;
            default:
                // For other states, just acknowledge and continue
                this.sendBotMessage("Danke für Ihre Nachricht. Lassen Sie uns fortfahren.");
                break;
        }
    }

    handleQuestionResponse(message) {
        const unitData = this.getCurrentUnitData();
        if (!unitData || !unitData.questions) return;

        const question = unitData.questions[this.questionIndex];
        
        // Acknowledge response
        this.sendBotMessage("Danke für Ihre Antwort.");
        
        // Provide correct answer for self-checking
        setTimeout(() => {
            this.sendBotMessage(`Die richtige Antwort ist: ${question.correctAnswer}`);
            if (question.explanation) {
                setTimeout(() => {
                    this.sendBotMessage(question.explanation);
                    // Move to next question
                    this.questionIndex++;
                    setTimeout(() => {
                        this.askNextQuestion();
                    }, 1000);
                }, 1000);
            } else {
                // Move to next question
                this.questionIndex++;
                setTimeout(() => {
                    this.askNextQuestion();
                }, 1000);
            }
        }, 1000);
    }

    handleIdleResponse(message) {
        // Simple response when in idle state
        const responses = [
            "Interessant! Möchten Sie zur nächsten Einheit gehen?",
            "Danke für Ihre Nachricht. Sollen wir weitermachen?",
            "Ich verstehe. Wenn Sie bereit sind, können wir fortfahren."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        this.sendBotMessage(randomResponse);
    }

    sendBotMessage(message) {
        const teacherName = this.teacher === 'female' ? 'Frau Schmidt' : 'Herr Schmidt';
        this.addMessageToChat(`${teacherName}: ${message}`, 'bot');
    }

    addMessageToChat(message, sender) {
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        
        // Format message text (handle markdown-like syntax)
        let formattedMessage = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedMessage = formattedMessage.replace(/\n/g, '<br>');
        
        messageElement.innerHTML = formattedMessage;
        
        // Add to chat container
        this.chatContainer.appendChild(messageElement);
        
        // Scroll to bottom
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        
        // Add to history
        this.messageHistory.push({
            text: message,
            sender: sender
        });
    }

    getCurrentUnitData() {
        if (this.currentBook === 'menschen') {
            try {
                return allModuleData.menschen[this.currentModule].units[this.currentUnit];
            } catch (error) {
                console.error('Error getting unit data:', error);
                return null;
            }
        } else {
            try {
                return this.lessonData.mittelpunkt[this.currentLektion].units[this.currentUnit];
            } catch (error) {
                console.error('Error getting unit data:', error);
                return null;
            }
        }
    }

    changeModule(moduleKey) {
        if (this.currentBook !== 'menschen') return false;
        if (!allModuleData.menschen[moduleKey]) return false;
        
        this.currentModule = moduleKey;
        this.currentUnit = 'A';
        this.resetState();
        return true;
    }

    changeLektion(lektionKey) {
        if (this.currentBook !== 'mittelpunkt') return false;
        if (!this.lessonData.mittelpunkt[lektionKey]) return false;
        
        this.currentLektion = lektionKey;
        this.currentUnit = 'A';
        this.resetState();
        return true;
    }

    changeUnit(unit) {
        const validUnits = ['A', 'B', 'C', 'D', 'E', 'F'];
        if (!validUnits.includes(unit)) return false;
        
        // Check if unit exists in current module/lektion
        let unitData;
        if (this.currentBook === 'menschen') {
            unitData = allModuleData.menschen[this.currentModule].units[unit];
        } else {
            unitData = this.lessonData.mittelpunkt[this.currentLektion].units[unit];
        }
        
        if (!unitData) return false;
        
        this.currentUnit = unit;
        this.resetState();
        return true;
    }

    changeBook(book) {
        if (book !== 'menschen' && book !== 'mittelpunkt') return false;
        
        // Check if Mittelpunkt is unlocked
        if (book === 'mittelpunkt' && !allModuleData.menschen.completed) {
            return false;
        }
        
        this.currentBook = book;
        if (book === 'menschen') {
            this.currentModule = 'modul1';
        } else {
            this.currentLektion = 'lektion1';
        }
        this.currentUnit = 'A';
        this.resetState();
        return true;
    }

    changeTeacher(gender) {
        if (gender !== 'male' && gender !== 'female') return false;
        
        this.teacher = gender;
        return true;
    }

    nextUnit() {
        const units = ['A', 'B', 'C', 'D', 'E', 'F'];
        const currentIndex = units.indexOf(this.currentUnit);
        
        if (currentIndex === -1 || currentIndex === units.length - 1) {
            // Last unit, try to move to next module/lektion
            if (this.currentBook === 'menschen') {
                const modules = ['modul1', 'modul2', 'modul3', 'modul4'];
                const currentModuleIndex = modules.indexOf(this.currentModule);
                
                if (currentModuleIndex === -1 || currentModuleIndex === modules.length - 1) {
                    // Last module, check if we should unlock Mittelpunkt
                    if (!allModuleData.menschen.completed) {
                        allModuleData.menschen.completed = true;
                        localStorage.setItem('menschenCompleted', 'true');
                        this.sendBotMessage("Herzlichen Glückwunsch! Sie haben den Menschen B1 Kurs abgeschlossen. Jetzt können Sie mit dem Mittelpunkt B1+ Kurs beginnen.");
                        
                        // Enable Mittelpunkt option
                        document.querySelectorAll('.book-option').forEach(option => {
                            if (option.getAttribute('data-book') === 'mittelpunkt') {
                                option.classList.remove('disabled');
                                option.removeAttribute('title');
                            }
                        });
                        
                        return false;
                    }
                    return false;
                }
                
                // Move to next module
                this.currentModule = modules[currentModuleIndex + 1];
                this.currentUnit = 'A';
                this.resetState();
                return true;
            } else {
                // For Mittelpunkt, we would need similar logic if there are multiple lektionen
                return false;
            }
        }
        
        // Move to next unit
        this.currentUnit = units[currentIndex + 1];
        this.resetState();
        return true;
    }

    prevUnit() {
        const units = ['A', 'B', 'C', 'D', 'E', 'F'];
        const currentIndex = units.indexOf(this.currentUnit);
        
        if (currentIndex <= 0) {
            // First unit, try to move to previous module/lektion
            if (this.currentBook === 'menschen') {
                const modules = ['modul1', 'modul2', 'modul3', 'modul4'];
                const currentModuleIndex = modules.indexOf(this.currentModule);
                
                if (currentModuleIndex <= 0) {
                    return false;
                }
                
                // Move to previous module, last unit
                this.currentModule = modules[currentModuleIndex - 1];
                this.currentUnit = 'F';
                this.resetState();
                return true;
            } else {
                // For Mittelpunkt, we would need similar logic if there are multiple lektionen
                return false;
            }
        }
        
        // Move to previous unit
        this.currentUnit = units[currentIndex - 1];
        this.resetState();
        return true;
    }

    resetState() {
        this.currentState = 'introduction';
        this.questionIndex = 0;
        this.chatContainer.innerHTML = '';
        this.messageHistory = [];
        this.init();
    }

    updateProgress() {
        // Calculate progress percentage
        let progressPercentage = 0;
        
        if (this.currentBook === 'menschen') {
            const modules = ['modul1', 'modul2', 'modul3', 'modul4'];
            const units = ['A', 'B', 'C', 'D', 'E', 'F'];
            
            const totalSteps = modules.length * units.length;
            const currentModuleIndex = modules.indexOf(this.currentModule);
            const currentUnitIndex = units.indexOf(this.currentUnit);
            
            if (currentModuleIndex !== -1 && currentUnitIndex !== -1) {
                const completedSteps = (currentModuleIndex * units.length) + currentUnitIndex;
                progressPercentage = (completedSteps / totalSteps) * 100;
            }
        } else {
            // For Mittelpunkt, similar logic would apply
            const units = ['A', 'B', 'C', 'D', 'E', 'F'];
            const currentUnitIndex = units.indexOf(this.currentUnit);
            
            if (currentUnitIndex !== -1) {
                progressPercentage = (currentUnitIndex / units.length) * 100;
            }
        }
        
        // Update progress bar
        document.getElementById('progress-fill').style.width = `${progressPercentage}%`;
        
        // Update unit indicators
        document.querySelectorAll('.unit-indicator').forEach(indicator => {
            indicator.classList.remove('active', 'completed');
            
            const unit = indicator.getAttribute('data-unit');
            const units = ['A', 'B', 'C', 'D', 'E', 'F'];
            const currentUnitIndex = units.indexOf(this.currentUnit);
            const indicatorUnitIndex = units.indexOf(unit);
            
            if (unit === this.currentUnit) {
                indicator.classList.add('active');
            } else if (indicatorUnitIndex < currentUnitIndex) {
                indicator.classList.add('completed');
            }
        });
    }
}
