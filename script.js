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
        matchElement.classList.add('bg-white', 'rounded-lg', 'shadow-md', 'p-4', 'text-center');
        matchElement.innerHTML = `<h3 class='font-bold text-lg'>${match[0]} vs ${match[1]}</h3><p>${match[2]}</p>`;
        
        if (match[3] === 'live') {
            liveMatchesContainer.appendChild(matchElement);
        } else {
            upcomingMatchesContainer.appendChild(matchElement);
        }
    });
}

document.getElementById('updateMatches').addEventListener('click', fetchMatches);
fetchMatches();
