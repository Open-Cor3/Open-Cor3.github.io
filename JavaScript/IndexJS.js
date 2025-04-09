let skins = [];

fetch("../JSON/Skins.json")
 .then(res => res.json())
 .then(data => {
     skins = data;
     console.log(skins); 
     renderSkins(skins);
 })
 .catch(err => console.error("Failed to load skins:", err));


 // DOM elements
 const skinsGrid = document.getElementById('skins-grid');
 const nameSearch = document.getElementById('name-search');
 const rarityFilter = document.getElementById('rarity-filter');
 const valueFilter = document.getElementById('value-filter');
 const demandFilter = document.getElementById('demand-filter');
 const modalOverlay = document.getElementById('modal-overlay');
 const modalClose = document.getElementById('modal-close');
 const modalImage = document.getElementById('modal-image');
 const modalDetails = document.getElementById('modal-details');

 // Function to render the skins
 function renderSkins(skinsToRender) {
     skinsGrid.innerHTML = '';
     
     if (skinsToRender.length === 0) {
         const noResults = document.createElement('div');
         noResults.className = 'no-results';
         noResults.textContent = 'No skins found matching your criteria';
         skinsGrid.appendChild(noResults);
         return;
     }
     
     skinsToRender.forEach((skin, index) => {
         const skinCard = document.createElement('div');
         skinCard.className = 'skin-card';
         skinCard.style.animationDelay = `${index * 0.1}s`;
         skinCard.setAttribute('data-skin-id', skin.id);
         
         skinCard.innerHTML = `
             <div class="skin-image">
                 <img src="${skin.image}" alt="${skin.name}" onerror="this.src='/api/placeholder/200/150'; this.onerror=null;">
             </div>
             <div class="skin-details">
                 <div class="skin-name">
                     ${skin.name}
                     <span class="rarity-badge ${skin.rarity}">${skin.rarity}</span>
                 </div>
                 <div class="skin-info">
                     <div class="info-item">
                         <span class="info-label">Value</span>
                         <span class="info-value value-badge ${skin.value}">${skin.value}</span>
                     </div>
                     <div class="info-item">
                         <span class="info-label">Demand</span>
                         <span class="info-value value-badge ${skin.demand}">${skin.demand}</span>
                     </div>
                     <div class="info-item" style="grid-column: span 2;">
                         <span class="info-label">Price</span>
                         <span class="info-value">${skin.price}</span>
                     </div>
                 </div>
             </div>
         `;
         
         skinsGrid.appendChild(skinCard);
         
         skinCard.addEventListener('click', () => {
             openModal(skin);
         });
     });
 }

 // Function to open the modal with skin details
 function openModal(skin) {
     modalImage.src = skin.image;
     modalImage.alt = skin.name;
     modalImage.onerror = function() {
         this.src = '/api/placeholder/400/300';
         this.onerror = null;
     };
     
     modalDetails.innerHTML = `
         <div class="modal-detail-item">
             <span class="modal-detail-label">Name</span>
             <span class="modal-detail-value">${skin.name}</span>
         </div>
         <div class="modal-detail-item">
             <span class="modal-detail-label">Rarity</span>
             <span class="modal-detail-value">
                 <span class="rarity-badge ${skin.rarity}">${skin.rarity}</span>
             </span>
         </div>
         <div class="modal-detail-item">
             <span class="modal-detail-label">Value</span>
             <span class="modal-detail-value value-badge ${skin.value}">${skin.value}</span>
         </div>
         <div class="modal-detail-item">
             <span class="modal-detail-label">Demand</span>
             <span class="modal-detail-value value-badge ${skin.demand}">${skin.demand}</span>
         </div>
         <div class="modal-detail-item">
             <span class="modal-detail-label">Price Range</span>
             <span class="modal-detail-value">${skin.price}</span>
         </div>
     `;
     
     modalOverlay.classList.add('active');
     
     // Prevent scrolling when modal is open
     document.body.style.overflow = 'hidden';
 }
 function closeModal() {
     modalOverlay.classList.remove('active');
     document.body.style.overflow = '';
 }

 // Filter function
 function filterSkins() {
     const nameQuery = nameSearch.value.toLowerCase();
     const rarityQuery = rarityFilter.value.toLowerCase();
     const valueQuery = valueFilter.value.toLowerCase();
     const demandQuery = demandFilter.value.toLowerCase();
     
     const filteredSkins = skins.filter(skin => {
         // Check if skin matches all filters
         if (nameQuery && !skin.name.toLowerCase().includes(nameQuery)) {
             return false;
         }
         
         if (rarityQuery && skin.rarity.toLowerCase() !== rarityQuery) {
             return false;
         }
         
         if (valueQuery && skin.value.toLowerCase() !== valueQuery) {
             return false;
         }
         
         if (demandQuery && skin.demand.toLowerCase() !== demandQuery) {
             return false;
         }
         
         return true;
     });
     
     renderSkins(filteredSkins);
 }

 // Add event listeners
 nameSearch.addEventListener('input', filterSkins);
 rarityFilter.addEventListener('change', filterSkins);
 valueFilter.addEventListener('change', filterSkins);
 demandFilter.addEventListener('change', filterSkins);
 
 // Modal event listeners
 modalClose.addEventListener('click', closeModal);
 modalOverlay.addEventListener('click', (e) => {
     if (e.target === modalOverlay) {
         closeModal();
     }
 });
 
 // Close modal with escape key
 document.addEventListener('keydown', (e) => {
     if (e.key === 'Escape') {
         closeModal();
     }
 });

 // Initial render
 renderSkins(skins);