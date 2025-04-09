let skins = [];
    
// Fetch skins from JSON file
fetch("../JSON/Skins.json")
.then(res => res.json())
.then(data => {
    skins = data;
    console.log(skins); 
    renderSearchResults(skins); // Render
})
.catch(err => console.error("Failed to load skins:", err));

// DOM Elements
const yourSearch = document.getElementById('your-search');
const theirSearch = document.getElementById('their-search');
const yourSearchResults = document.getElementById('your-search-results');
const theirSearchResults = document.getElementById('their-search-results');
const yourItems = document.getElementById('your-items');
const theirItems = document.getElementById('their-items');
const yourTotal = document.getElementById('your-total');
const theirTotal = document.getElementById('their-total');
const yourValue = document.getElementById('your-value');
const theirValue = document.getElementById('their-value');
const tradeStatus = document.getElementById('trade-status');
const resetTrade = document.getElementById('reset-trade');

// Function to render search results
function renderSearchResults(skins) {
    function filterSkins(query) {
        return skins.filter(skin => skin.name.toLowerCase().includes(query.toLowerCase()));
    }

    yourSearch.addEventListener('input', (e) => {
        const query = e.target.value;
        const filteredSkins = filterSkins(query);
        displaySearchResults(filteredSkins, yourSearchResults);
    });

    theirSearch.addEventListener('input', (e) => {
        const query = e.target.value;
        const filteredSkins = filterSkins(query);
        displaySearchResults(filteredSkins, theirSearchResults);
    });
}

// Display search results
function displaySearchResults(skins, resultContainer) {
    resultContainer.innerHTML = '';
    skins.forEach(skin => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-item';
        resultItem.textContent = skin.name;
        resultItem.addEventListener('click', () => addSkinToTrade(skin));
        resultContainer.appendChild(resultItem);
    });
}

// Function to add skin to the trade (your or their side)
function addSkinToTrade(skin) {
    const side = getSideToAdd();

    const tradeItem = document.createElement('div');
    tradeItem.className = 'trade-item';
    tradeItem.textContent = `${skin.name} (${skin.price})`;
    tradeItem.dataset.id = skin.id;
    tradeItem.addEventListener('click', () => removeSkinFromTrade(skin, tradeItem));

    if (side === 'your') {
        yourItems.appendChild(tradeItem);
        updateTotal('your');
    } else {
        theirItems.appendChild(tradeItem);
        updateTotal('their');
    }
}

// Function to remove skin from trade
function removeSkinFromTrade(skin, tradeItem) {
    tradeItem.remove();
    updateTotal(skin.side);
}

// Function to determine which side the skin will be added to
function getSideToAdd() {
    return 'your';
}

// Function to update the total value for a side
function updateTotal(side) {
    let total = 0;
    const items = side === 'your' ? yourItems.children : theirItems.children;
    Array.from(items).forEach(item => {
        const skinId = item.dataset.id;
        const skin = skins.find(skin => skin.id == skinId);
        if (skin) {
            total += skin.avgPrice;
        }
    });

    if (side === 'your') {
        yourTotal.textContent = `${total} 🥇`;
        yourValue.textContent = `${total} 🥇`;
    } else {
        theirTotal.textContent = `${total} 🥇`;
        theirValue.textContent = `${total} 🥇`;
    }

    // Update trade status
    updateTradeStatus();
}

// Function to update the trade status
function updateTradeStatus() {
    const yourTotalValue = parseInt(yourTotal.textContent.replace(' 🥇', ''), 10);
    const theirTotalValue = parseInt(theirTotal.textContent.replace(' 🥇', ''), 10);

    const difference = yourTotalValue - theirTotalValue;

    let status = 'Add items to analyze trade';
    if (difference > 0) {
        status = 'Your offer is higher';
    } else if (difference < 0) {
        status = 'Their offer is higher';
    } else {
        status = 'Trade is balanced';
    }

    tradeStatus.textContent = status;
    document.getElementById('result-difference').textContent = `Difference: ${Math.abs(difference)} 🥇`;
}

// Reset trade button listener
resetTrade.addEventListener('click', () => {
    yourItems.innerHTML = '';
    theirItems.innerHTML = '';
    yourTotal.textContent = '0 🥇';
    theirTotal.textContent = '0 🥇';
    tradeStatus.textContent = 'Add items to analyze trade';
    document.getElementById('result-difference').textContent = '';
});