// Simple sentiment analysis function
function analyzeSentiment(text) {
    const positiveWords = ['happy', 'good', 'great', 'excited', 'joy', 'love', 'awesome', 'fantastic', 'wonderful', 'amazing'];
    const negativeWords = ['sad', 'stressed', 'anxious', 'tired', 'angry', 'frustrated', 'worried', 'depressed', 'bad', 'terrible'];

    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach(word => {
        if (positiveWords.includes(word)) positiveCount++;
        if (negativeWords.includes(word)) negativeCount++;
    });

    const total = positiveCount + negativeCount;
    if (total === 0) return 0.5; // neutral
    return positiveCount / total;
}

// Get recommendations based on sentiment and mood level
function getRecommendations(sentiment, moodLevel) {
    let recs = [];
    if (sentiment > 0.6 && moodLevel > 7) {
        recs = [
            "Keep up the positive mindset! Consider sharing your good mood with friends.",
            "Try a new hobby to maintain this high energy.",
            "Practice gratitude by journaling three things you're thankful for."
        ];
    } else if (sentiment > 0.4 && moodLevel > 4) {
        recs = [
            "You're doing well! Take a moment to relax and enjoy the day.",
            "Listen to your favorite music to boost your mood.",
            "Connect with loved ones for some positive interaction."
        ];
    } else {
        recs = [
            "Remember to take deep breaths and practice mindfulness.",
            "Consider talking to a friend or counselor about your feelings.",
            "Engage in physical activity like a walk to release endorphins.",
            "Try journaling your thoughts to process emotions.",
            "Use relaxation techniques such as meditation or progressive muscle relaxation."
        ];
    }
    return recs;
}

// Load data from localStorage
function loadData() {
    const data = localStorage.getItem('wellnessData');
    return data ? JSON.parse(data) : [];
}

// Save data to localStorage
function saveData(data) {
    localStorage.setItem('wellnessData', JSON.stringify(data));
}

// Update chart
function updateChart() {
    const data = loadData();
    const ctx = document.getElementById('moodChart').getContext('2d');
    const labels = data.map(entry => new Date(entry.date).toLocaleDateString());
    const moodLevels = data.map(entry => entry.level);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Mood Level',
                data: moodLevels,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    });
}

// Update recommendations
function updateRecommendations(sentiment, moodLevel) {
    const recs = getRecommendations(sentiment, moodLevel);
    const recsDiv = document.getElementById('recs');
    recsDiv.innerHTML = '<h5>Based on your check-in:</h5><ul>' + recs.map(rec => `<li>${rec}</li>`).join('') + '</ul>';
    recsDiv.className = 'alert alert-info';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    updateChart();

    const moodLevelInput = document.getElementById('moodLevel');
    const moodValue = document.getElementById('moodValue');
    moodLevelInput.addEventListener('input', () => {
        moodValue.textContent = moodLevelInput.value;
    });

    const moodForm = document.getElementById('moodForm');
    moodForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = document.getElementById('moodText').value.trim();
        const level = parseInt(moodLevelInput.value);
        if (!text) {
            alert('Please describe your feelings.');
            return;
        }
        const sentiment = analyzeSentiment(text);
        const entry = {
            date: new Date().toISOString(),
            text: text,
            level: level,
            sentiment: sentiment
        };
        const data = loadData();
        data.push(entry);
        saveData(data);
        updateChart();
        updateRecommendations(sentiment, level);
        moodForm.reset();
        moodValue.textContent = '5';
        alert('Check-in submitted!');
    });
});
