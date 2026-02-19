// Load and render listings
async function loadListings(filterType = 'All') {
  const container = document.getElementById('listings-container');
  if (!container) return;

  // Merge: JSON file (demo) + localStorage (your uploaded ones)
  const res = await fetch('data/listings.json');
  const data = await res.json();
  const local = JSON.parse(localStorage.getItem('listings') || '[]');
  let listings = [...local, ...data.listings];

  // Filter by type / category
  if (filterType === 'Parking') {
    listings = listings.filter(l => l.amenities && l.amenities.includes('Parking'));
  } else if (filterType !== 'All') {
    listings = listings.filter(l => l.type === filterType);
  }

  // Filter by postcode (from search)
  const postcodeFilter = localStorage.getItem('postcodeFilter');
  if (postcodeFilter) {
    listings = listings.filter(l => l.postcode && l.postcode.toUpperCase().startsWith(postcodeFilter.toUpperCase()));
  }

  // Filter by max weekly price per person (from search)
  const maxWeekly = parseInt(localStorage.getItem('maxWeekly'));
  if (maxWeekly) {
    listings = listings.filter(l => {
      const tenants = l.maxTenants || 1;
      const weekly = Math.round(l.price * 12 / 52 / tenants);
      return weekly <= maxWeekly;
    });
  }

  container.innerHTML = '';

  if (listings.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:40px;color:#717375">No properties found</div>';
    return;
  }

  // Saved IDs
  const saved = JSON.parse(localStorage.getItem('savedListings') || '[]');

  listings.forEach(listing => {
    const avail = new Date(listing.available);
    const availStr = avail.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    // Weekly per-person price
    const tenants = listing.maxTenants || 1;
    const weeklyPP = Math.round(listing.price * 12 / 52 / tenants);

    const isSaved = saved.includes(listing.id);
    const heartIcon = isSaved ? '❤️' : '🤍';

    const card = document.createElement('div');
    card.className = 'listing-card';
    card.onclick = () => location.href = 'listing.html?id=' + listing.id;

    const photoContent = listing.photos && listing.photos.length > 0
      ? `<img class="listing-photo" src="${listing.photos[0]}" alt="${listing.title}">`
      : `<div class="listing-photo-placeholder">🏠</div>`;

    card.innerHTML = `
      <div class="listing-photo-wrap">
        ${photoContent}
        <button class="save-btn" data-id="${listing.id}" onclick="event.stopPropagation(); toggleSave(this, '${listing.id}')">${heartIcon}</button>
        <div class="available-badge">Available ${availStr}</div>
      </div>
      <div class="listing-info">
        <div>
          <div class="listing-title">${listing.title}</div>
          <div class="listing-desc">${listing.description}</div>
          <div class="listing-type">${listing.type}${listing.furnished ? ' · Furnished' : ''}</div>
          <div class="listing-price">£${listing.price.toLocaleString()} <span>/month</span></div>
          <div class="listing-weekly">£${weeklyPP} <span>pp/week</span></div>
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

function toggleSave(btn, id) {
  const saved = JSON.parse(localStorage.getItem('savedListings') || '[]');
  const idx = saved.indexOf(id);
  if (idx === -1) {
    saved.push(id);
    btn.textContent = '❤️';
  } else {
    saved.splice(idx, 1);
    btn.textContent = '🤍';
  }
  localStorage.setItem('savedListings', JSON.stringify(saved));
}

// Auto-load on home page
if (document.getElementById('listings-container')) {
  loadListings();
}
