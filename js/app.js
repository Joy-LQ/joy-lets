// Load and render listings
async function loadListings(filterType = 'All') {
  const container = document.getElementById('listings-container');
  if (!container) return;

  // Merge: JSON file (demo) + localStorage (your uploaded ones)
  const res = await fetch('data/listings.json');
  const data = await res.json();
  const local = JSON.parse(localStorage.getItem('listings') || '[]');
  let listings = [...local, ...data.listings];

  // Filter by type
  if (filterType === 'Furnished') {
    listings = listings.filter(l => l.furnished);
  } else if (filterType !== 'All') {
    listings = listings.filter(l => l.type === filterType);
  }

  container.innerHTML = '';

  if (listings.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:40px;color:#717375">No properties found</div>';
    return;
  }

  listings.forEach(listing => {
    const avail = new Date(listing.available);
    const availStr = avail.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    const card = document.createElement('div');
    card.className = 'listing-card';
    card.onclick = () => location.href = 'listing.html?id=' + listing.id;

    const photoContent = listing.photos && listing.photos.length > 0
      ? `<img class="listing-photo" src="${listing.photos[0]}" alt="${listing.title}">`
      : `<div class="listing-photo-placeholder">🏠</div>`;

    card.innerHTML = `
      <div class="listing-photo-wrap">
        ${photoContent}
        <button class="save-btn" onclick="event.stopPropagation(); toggleSave(this)">🤍</button>
        <div class="available-badge">Available ${availStr}</div>
      </div>
      <div class="listing-info">
        <div>
          <div class="listing-title">${listing.title}</div>
          <div class="listing-desc">${listing.description}</div>
          <div class="listing-type">${listing.type}${listing.furnished ? ' · Furnished' : ''}</div>
          <div class="listing-price">£${listing.price.toLocaleString()} <span>/month</span></div>
        </div>
        <div class="listing-rating">
          <span class="star">⭐</span> ${listing.rating}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function filterListings(type, el) {
  document.querySelectorAll('.category-item').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  loadListings(type);
}

function toggleSave(btn) {
  btn.textContent = btn.textContent === '🤍' ? '❤️' : '🤍';
}

// Auto-load on home page
if (document.getElementById('listings-container')) {
  loadListings();
}
