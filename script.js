import config from './config.js';

const API_KEY = config.API_KEY;
const SHEET_ID = config.SHEET_ID;
const SHEET_NAME = config.SHEET_NAME;

async function fetchMatches() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
    try {
        console.log("Fetching data from:", url);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log("Fetched Data:", data);
        if (!data.values) throw new Error("No data found in the sheet");
        displayMatches(data.values.slice(1));
    } catch (error) {
        console.error('Error fetching matches:', error);
    }
}

function displayMatches(matches) {
    const liveMatchesContainer = document.getElementById('liveMatches');
    const upcomingMatchesContainer = document.getElementById('upcomingMatches');
    
    liveMatchesContainer.innerHTML = '';
    upcomingMatchesContainer.innerHTML = '';
    
    matches.forEach(match => {
        const matchElement = document.createElement('div');
        matchElement.classList.add('bg-white', 'rounded-lg', 'shadow-md', 'overflow-hidden');
        
        const posterUrl = match[5]; // poster_url
        const streamLink1 = match[7]; // stream_link1
        const streamLink2 = match[8]; // stream_link2
        
        matchElement.innerHTML = `
            <img src="${posterUrl}" alt="${match[2]} vs ${match[3]}" class="w-full h-48 object-cover">
            <div class="p-4">
                <div class="flex justify-between items-center">
                    <span class="bg-green-500 text-white text-sm px-2 py-1 rounded">${match[6] === 'live' ? 'LIVE NOW' : 'UPCOMING'}</span>
                    <span class="text-gray-600 text-sm">${match[4]}</span>
                </div>
                <h3 class="text-xl font-bold mt-2">${match[2]} vs ${match[3]}</h3>
                <p class="text-gray-600">${match[1]}</p>
                ${match[6] === 'live' ? `
                    <div class="mt-4">
                        ${streamLink1 ? `<button class="watch-btn bg-green-500 text-white px-4 py-2 rounded mr-2" data-link="${streamLink1}">Stream 1 - HD</button>` : ''}
                        ${streamLink2 ? `<button class="watch-btn bg-green-500 text-white px-4 py-2 rounded" data-link="${streamLink2}">Stream 2 - SD</button>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
        
        if (match[6] === 'live') {
            liveMatchesContainer.appendChild(matchElement);
        } else {
            upcomingMatchesContainer.appendChild(matchElement);
        }
    });

    // Add event listeners to watch buttons
    document.querySelectorAll('.watch-btn').forEach(button => {
        button.addEventListener('click', () => {
            const streamUrl = button.getAttribute('data-link');
            openVideoPlayer(streamUrl); // Open the stream link
        });
    });
}

function openVideoPlayer(streamUrl) {
    const videoModal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.src = streamUrl;
    videoModal.classList.remove('hidden');
}

function closeVideoPlayer() {
    const videoModal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.src = '';
    videoModal.classList.add('hidden');
}

document.getElementById('updateMatches').addEventListener('click', fetchMatches);
document.getElementById('closeModal').addEventListener('click', closeVideoPlayer);

// Initial fetch
fetchMatches();