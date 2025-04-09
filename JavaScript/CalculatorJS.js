let skins = [];
let yourTrade = [];
let theirTrade = [];
    
fetch("../JSON/Skins.json")
    .then(res => res.json())
    .then(data => {
        skins = data;
        console.log("Skins loaded:", skins.length);
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
const resultDifference = document.getElementById('result-difference');
const resetTradeBtn = document.getElementById('reset-trade');

// Handle search functionality
function handleSearch(input, resultsContainer, side) {
    const query = input.value.toLowerCase();
    
    if (query.length < 2) {
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
        return;
    }
    
    const matches = skins.filter(skin => 
        skin.name.toLowerCase().includes(query)
    ).slice(0, 5);
    
    resultsContainer.innerHTML = '';
    
    if (matches.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">No skins found</div>';
        resultsContainer.style.display = 'block';
        return;
    }
    
    matches.forEach(skin => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
            <img src="${skin.image}" alt="${skin.name}" onerror="this.src='/api/placeholder/40/40'; this.onerror=null;">
            <div class="result-info">
                <div class="result-name">${skin.name}</div>
                <div class="result-price">${skin.price}</div>
            </div>
        `;
        
        resultItem.addEventListener('click', () => {
            if (side === 'your') {
                addItemToTrade(skin, yourItems, yourTrade);
            } else {
                addItemToTrade(skin, theirItems, theirTrade);
            }
            input.value = '';
            resultsContainer.style.display = 'none';
            updateTradeAnalysis();
        });
        
        resultsContainer.appendChild(resultItem);
    });
    
    resultsContainer.style.display = 'block';
}

// Extract numerical value from price string
function extractValue(priceString) {
    if (!priceString) return 0;
    
    const matches = priceString.match(/[\d,]+/g);
    if (!matches || matches.length === 0) return 0;
    
    if (matches.length === 1) {
        return parseInt(matches[0].replace(/,/g, ''));
    } else {
        const min = parseInt(matches[0].replace(/,/g, ''));
        const max = parseInt(matches[1].replace(/,/g, ''));
        return Math.round((min + max) / 2);
    }
}

// Add item to trade
function addItemToTrade(skin, container, tradeArray) {
    tradeArray.push(skin);
    
    const itemElement = document.createElement('div');
    itemElement.className = 'trade-item';
    itemElement.innerHTML = `
        <div class="item-image">
            <img src="${skin.image}" alt="${skin.name}" onerror="this.src='/api/placeholder/80/80'; this.onerror=null;">
        </div>
        <div class="item-info">
            <div class="item-name">${skin.name}</div>
            <div class="item-price">${skin.price}</div>
        </div>
        <button class="remove-item" data-index="${tradeArray.length - 1}">
            <i class="fa-solid fa-times"></i>
        </button>
    `;
    
    const removeButton = itemElement.querySelector('.remove-item');
    removeButton.addEventListener('click', () => {
        const index = parseInt(removeButton.getAttribute('data-index'));
        tradeArray.splice(index, 1);
        container.removeChild(itemElement);
        
        container.querySelectorAll('.remove-item').forEach((btn, idx) => {
            btn.setAttribute('data-index', idx);
        });
        
        updateTradeAnalysis();
    });
    
    container.appendChild(itemElement);
}

// Update trade analysis
function updateTradeAnalysis() {
    let yourTotalValue = 0;
    let theirTotalValue = 0;
    
    yourTrade.forEach(item => {
        yourTotalValue += extractValue(item.price);
    });
    
    theirTrade.forEach(item => {
        theirTotalValue += extractValue(item.price);
    });
    
    yourTotal.textContent = `${yourTotalValue.toLocaleString()} 🥇`;
    theirTotal.textContent = `${theirTotalValue.toLocaleString()} 🥇`;
    
    yourValue.textContent = `${yourTotalValue.toLocaleString()} 🥇`;
    theirValue.textContent = `${theirTotalValue.toLocaleString()} 🥇`;
    
    const difference = theirTotalValue - yourTotalValue;
    
    if (yourTrade.length === 0 && theirTrade.length === 0) {
        tradeStatus.textContent = 'Add items to analyze trade';
        tradeStatus.className = 'trade-status';
        resultDifference.textContent = '';
    } else if (difference > 0) {
        tradeStatus.textContent = 'Win for you! 🎉';
        tradeStatus.className = 'trade-status win';
        resultDifference.textContent = `+${difference.toLocaleString()} 🥇 in your favor`;
        resultDifference.className = 'result-difference win';
    } else if (difference < 0) {
        tradeStatus.textContent = 'Loss for you! ⚠️';
        tradeStatus.className = 'trade-status loss';
        resultDifference.textContent = `${Math.abs(difference).toLocaleString()} 🥇 in their favor`;
        resultDifference.className = 'result-difference loss';
    } else {
        tradeStatus.textContent = 'Even trade 🤝';
        tradeStatus.className = 'trade-status even';
        resultDifference.textContent = 'Equal value on both sides';
        resultDifference.className = 'result-difference even';
    }
}

// Reset trade
function resetTrade() {
    yourTrade = [];
    theirTrade = [];
    yourItems.innerHTML = '';
    theirItems.innerHTML = '';
    updateTradeAnalysis();
}

// Event listeners
yourSearch.addEventListener('input', () => handleSearch(yourSearch, yourSearchResults, 'your'));
theirSearch.addEventListener('input', () => handleSearch(theirSearch, theirSearchResults, 'their'));
resetTradeBtn.addEventListener('click', resetTrade);

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        yourSearchResults.style.display = 'none';
        theirSearchResults.style.display = 'none';
    }
});

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});