document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeQuiz();
    initializeCarousel();
    initializeWeatherAPI();
    initializeSmoothScrolling();
});

function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initializeQuiz() {
    const quizQuestions = [
        {
            question: "What does HTML stand for?",
            options: [
                "HyperText Markup Language",
                "High Tech Modern Language", 
                "Home Tool Markup Language",
                "Hyperlink and Text Markup Language"
            ],
            correct: 0
        },
        {
            question: "Which CSS property is used to change the text color of an element?",
            options: [
                "font-color",
                "text-color",
                "color",
                "background-color"
            ],
            correct: 2
        },
        {
            question: "Which method is used to add an element at the end of an array in JavaScript?",
            options: [
                "append()",
                "push()",
                "add()",
                "insert()"
            ],
            correct: 1
        },
        {
            question: "What is the correct way to declare a JavaScript variable?",
            options: [
                "variable myVar;",
                "v myVar;",
                "var myVar;",
                "declare myVar;"
            ],
            correct: 2
        },
        {
            question: "Which HTML element is used to define the structure of an HTML document?",
            options: [
                "<body>",
                "<html>",
                "<head>",
                "<document>"
            ],
            correct: 1
        }
    ];

    let currentQuestion = 0;
    let score = 0;
    let selectedAnswer = null;

    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizStart = document.getElementById('quiz-start');
    const quizContent = document.getElementById('quiz-content');
    const quizResults = document.getElementById('quiz-results');
    const questionText = document.getElementById('question-text');
    const answerOptions = document.getElementById('answer-options');
    const nextBtn = document.getElementById('next-btn');
    const progress = document.getElementById('progress');
    const questionCounter = document.getElementById('question-counter');
    const scoreDisplay = document.getElementById('score-display');
    const resultMessage = document.getElementById('result-message');
    const restartQuizBtn = document.getElementById('restart-quiz-btn');

    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', startQuiz);
    }

    if (restartQuizBtn) {
        restartQuizBtn.addEventListener('click', restartQuiz);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextQuestion);
    }

    function startQuiz() {
        currentQuestion = 0;
        score = 0;
        selectedAnswer = null;
        
        quizStart.classList.add('hidden');
        quizContent.classList.remove('hidden');
        quizResults.classList.add('hidden');
        
        displayQuestion();
    }

    function displayQuestion() {
        const question = quizQuestions[currentQuestion];
        
        questionText.textContent = question.question;
        questionCounter.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
        
        const progressPercent = ((currentQuestion + 1) / quizQuestions.length) * 100;
        progress.style.width = `${progressPercent}%`;
        
        answerOptions.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'answer-option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => selectAnswer(index));
            answerOptions.appendChild(optionElement);
        });
        
        nextBtn.classList.add('hidden');
        selectedAnswer = null;
    }

    function selectAnswer(answerIndex) {
        selectedAnswer = answerIndex;
        const options = document.querySelectorAll('.answer-option');
        const question = quizQuestions[currentQuestion];
        
        options.forEach(option => {
            option.classList.remove('selected', 'correct', 'incorrect');
        });
        
        options[answerIndex].classList.add('selected');
        
        setTimeout(() => {
            options.forEach((option, index) => {
                if (index === question.correct) {
                    option.classList.add('correct');
                } else if (index === answerIndex && index !== question.correct) {
                    option.classList.add('incorrect');
                }
            });
            
            if (answerIndex === question.correct) {
                score++;
            }
            
            nextBtn.classList.remove('hidden');
        }, 500);
    }

    function nextQuestion() {
        currentQuestion++;
        
        if (currentQuestion < quizQuestions.length) {
            displayQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        quizContent.classList.add('hidden');
        quizResults.classList.remove('hidden');
        
        const percentage = Math.round((score / quizQuestions.length) * 100);
        scoreDisplay.textContent = `${score}/${quizQuestions.length} (${percentage}%)`;
        
        let message = '';
        if (percentage >= 80) {
            message = '🎉 Excellent! You have a great understanding of web development!';
        } else if (percentage >= 60) {
            message = '👍 Good job! You have a solid foundation in web development.';
        } else if (percentage >= 40) {
            message = '📚 Not bad! Keep studying to improve your web development skills.';
        } else {
            message = '💪 Keep learning! Practice makes perfect in web development.';
        }
        
        resultMessage.textContent = message;
    }

    function restartQuiz() {
        quizResults.classList.add('hidden');
        quizStart.classList.remove('hidden');
    }
}

function initializeCarousel() {
    const track = document.getElementById('carousel-track');
    const slides = Array.from(track.children);
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    let currentSlide = 0;
    const slideWidth = slides[0].getBoundingClientRect().width;
    
    slides.forEach((slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    });
    
    function moveToSlide(targetIndex) {
        const targetSlide = slides[targetIndex];
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        
        slides[currentSlide].classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
        
        indicators[currentSlide].classList.remove('current-indicator');
        indicators[targetIndex].classList.add('current-indicator');
        
        currentSlide = targetIndex;
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const nextIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
            moveToSlide(nextIndex);
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
            moveToSlide(prevIndex);
        });
    }
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            moveToSlide(index);
        });
    });
    
    setInterval(() => {
        const nextIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
        moveToSlide(nextIndex);
    }, 5000);
}

function initializeWeatherAPI() {
    const cityInput = document.getElementById('city-input');
    const getWeatherBtn = document.getElementById('get-weather-btn');
    const weatherDisplay = document.getElementById('weather-display');
    const weatherError = document.getElementById('weather-error');
    const loading = document.getElementById('loading');
    
    if (getWeatherBtn) {
        getWeatherBtn.addEventListener('click', getWeather);
    }
    
    if (cityInput) {
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                getWeather();
            }
        });
    }
    
    async function getWeather() {
        const city = cityInput.value.trim();
        
        if (!city) {
            alert('Please enter a city name');
            return;
        }
        
        showLoading();
        
        try {
            const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
            
            if (!response.ok) {
                throw new Error('Weather data not found');
            }
            
            const data = await response.json();
            displayWeather(data, city);
        } catch (error) {
            showError();
        }
    }
    
    function showLoading() {
        weatherDisplay.classList.add('hidden');
        weatherError.classList.add('hidden');
        loading.classList.remove('hidden');
    }
    
    function displayWeather(data, cityName) {
        loading.classList.add('hidden');
        weatherError.classList.add('hidden');
        weatherDisplay.classList.remove('hidden');
        
        const current = data.current_condition[0];
        const area = data.nearest_area[0];
        
        document.getElementById('city-name').textContent = `${area.areaName[0].value}, ${area.country[0].value}`;
        document.getElementById('weather-date').textContent = new Date().toLocaleDateString();
        document.getElementById('temp-value').textContent = current.temp_C;
        document.getElementById('weather-desc').textContent = current.weatherDesc[0].value;
        document.getElementById('feels-like').textContent = current.FeelsLikeC;
        document.getElementById('humidity').textContent = current.humidity;
        document.getElementById('wind-speed').textContent = current.windspeedKmph;
        
        const weatherEmoji = getWeatherEmoji(current.weatherDesc[0].value);
        document.getElementById('weather-emoji').textContent = weatherEmoji;
    }
    
    function getWeatherEmoji(description) {
        const desc = description.toLowerCase();
        if (desc.includes('sunny') || desc.includes('clear')) return '☀️';
        if (desc.includes('cloud')) return '☁️';
        if (desc.includes('rain') || desc.includes('drizzle')) return '🌧️';
        if (desc.includes('storm') || desc.includes('thunder')) return '⛈️';
        if (desc.includes('snow')) return '❄️';
        if (desc.includes('fog') || desc.includes('mist')) return '🌫️';
        if (desc.includes('wind')) return '💨';
        return '🌤️';
    }
    
    function showError() {
        loading.classList.add('hidden');
        weatherDisplay.classList.add('hidden');
        weatherError.classList.remove('hidden');
    }
}