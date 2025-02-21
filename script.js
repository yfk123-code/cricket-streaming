// script.js
import config from './config.js';

const API_KEY = config.API_KEY;
const SHEET_ID = config.SHEET_ID;
const SHEET_NAME = config.SHEET_NAME;

// Fetch matches from Google Sheets
async function fetchMatches() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
    try {
        console.log("Fetching data from:", url);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log("Fetched Data:", data);
        if (!data.values) throw new Error("No data found in the sheet");
        displayMatches(data.values.slice(1)); // Skip header row
    } catch (error) {
        console.error('Error fetching matches:', error);
    }
}

// Display matches in the UI
function displayMatches(matches) {
    const liveMatchesContainer = document.getElementById('liveMatches');
    liveMatchesContainer.innerHTML = ''; // Clear previous content

    matches.forEach(match => {
        const [matchId, matchType, team1, team2, matchTime, posterUrl, status, streamLink1, streamLink2, streamLink3] = match;

        // Trim and lowercase status
        const matchStatus = status.trim().toLowerCase();

        const matchCard = `
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <img src="${posterUrl}" alt="${team1} vs ${team2}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-red-600 font-semibold">${matchStatus === 'live' ? 'LIVE NOW' : 'UPCOMING'}</span>
                        <span class="text-gray-600">Match #${matchId}</span>
                    </div>
                    <h3 class="font-bold mb-2">${team1} vs ${team2}</h3>
                    <p class="text-gray-600 mb-4">${matchType} - ${matchTime}</p>
                    <div class="space-y-2">
                        ${streamLink1 && isValidUrl(streamLink1) ? `<button onclick="playVideo('${streamLink1}')" class="w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700">Stream 1 - HD</button>` : ''}
                        ${streamLink2 && isValidUrl(streamLink2) ? `<button onclick="playVideo('${streamLink2}')" class="w-full bg-green-600 text-white text-center py-2 rounded hover:bg-green-700">Stream 2 - SD</button>` : ''}
                    </div>
                </div>
            </div>
        `;

        liveMatchesContainer.insertAdjacentHTML('beforeend', matchCard);
    });

    // Add event listeners to watch buttons
    document.querySelectorAll('.watch-btn').forEach(button => {
        button.addEventListener('click', () => {
            const streamUrl = button.getAttribute('data-link');
            playVideo(streamUrl);
        });
    });
}

// Video Player Functions
function playVideo(url) {
    document.getElementById('videoFrame').src = url;
    document.getElementById('videoModal').classList.remove('hidden');
}

function closeVideoModal() {
    document.getElementById('videoFrame').src = '';
    document.getElementById('videoModal').classList.add('hidden');
}

// Function to check if URL is valid
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

// Initial fetch of matches
fetchMatches();

// Refresh matches every 60 seconds (optional)
setInterval(fetchMatches, 60000);
