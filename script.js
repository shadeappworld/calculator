// Add your api key here for testing but do it from backend
const apiKey = 'AIzaSyDO2YVW5g8XgDEnBCH1LEur7SOCAEr4rYk';
const display = document.getElementById('display');
const explanationDisplay = document.getElementById('explanation');

function appendToDisplay(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = '';
     explanationDisplay.textContent = '';
}

function backspace() {
    display.value = display.value.slice(0, -1);
    explanationDisplay.textContent = '';
}

function calculate() {
    try {
        display.value = eval(display.value);
         explanationDisplay.textContent = '';
    } catch (error) {
        display.value = 'Error';
    }
}

async function explain() {
    const prompt = `You are an emphatic math professor called Shade AI. Just go straight to the point without using asterisks Explain how you got the answer to this calculation: ${display.value} . Give the output result at last`;
   explanationDisplay.textContent = "Thinking...";
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
                'x-goog-api-key': apiKey
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) {
                const explanation = data.candidates[0].content.parts[0].text;
                explanationDisplay.textContent = explanation;
            } else {
                explanationDisplay.textContent = 'Could not generate explanation.';
            }

    } catch (error) {
        console.error('Error:', error);
        explanationDisplay.textContent = `Error: ${error.message}`;
    }
}
const apiKey = 'AIzaSyDO2YVW5g8XgDEnBCH1LEur7SOCAEr4rYk';
const display = document.getElementById('display');
const explanationDisplay = document.getElementById('explanation');
const videoDisplay = document.getElementById('videoDisplay');

function appendToDisplay(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = '';
    explanationDisplay.textContent = '';
    videoDisplay.innerHTML = '';
}

function backspace() {
    display.value = display.value.slice(0, -1);
    explanationDisplay.textContent = '';
    videoDisplay.innerHTML = '';
}

function calculate() {
    try {
        display.value = eval(display.value);
        explanationDisplay.textContent = '';
    } catch (error) {
        display.value = 'Error';
    }
}

async function explain() {
    const prompt = `You are an emphatic math professor called Shade AI. Just go straight to the point without using asterisks. Explain how you got the answer to this calculation: ${display.value}. Give the output result at last.`;
    explanationDisplay.textContent = "Thinking...";
    videoDisplay.innerHTML = '';

    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) {
            const explanation = data.candidates[0].content.parts[0].text;
            explanationDisplay.textContent = explanation;

            // Fetch contextual video
            const searchQuery = encodeURIComponent(explanation.split(' ').slice(0, 5).join(' ')); // Use the first few words
            await fetchYouTubeVideo(searchQuery);
        } else {
            explanationDisplay.textContent = 'Could not generate explanation.';
        }

    } catch (error) {
        console.error('Error:', error);
        explanationDisplay.textContent = `Error: ${error.message}`;
    }
}

async function fetchYouTubeVideo(query) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${apiKey}&type=video&maxResults=1`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.items && data.items.length > 0) {
            const videoId = data.items[0].id.videoId;
            videoDisplay.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
        } else {
            videoDisplay.innerHTML = 'No videos found.';
        }
    } catch (error) {
        console.error('Error fetching YouTube video:', error);
        videoDisplay.innerHTML = `Error: ${error.message}`;
    }
}