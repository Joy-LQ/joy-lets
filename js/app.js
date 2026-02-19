// Load and render listings
async function loadListings(filterType = 'All') {
  const container = document.getElementById('listings-container');
  if (!container) return;

  const res = await fetch('data/listings.json');
  const data = await res.json();
  const local = JSON.parse(localStorage.getItem('listings') || '[]');

  // localStorage 优先：同 id 的以 localStorage 版本覆盖 JSON 版本
  const localIds = new Set(local.map(l => l.id));
  let listings = [...local, ...data.listings.filter(l => !localIds.has(l.id))];

  // 只显示 active 和 rented（unlisted 对租客隐藏）
  listings = listings.filter(l => l.status !== 'unlisted');

  // Filter by type / category
  if (filterType === 'Parking') {
    listings = listings.filter(l => l.amenities && l.amenities.includes('Parking'));
  } else if (filterType !== 'All') {
    listings = listings.filter(l => l.type === filterType);
  }

  // Filter by postcode
  const postcodeFilter = localStorage.getItem('postcodeFilter');
  if (postcodeFilter) {
    listings = listings.filter(l => l.postcode && l.postcode.toUpperCase().startsWith(postcodeFilter.toUpperCase()));
  }

  // Filter by max weekly price per person
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

  const saved = JSON.parse(localStorage.getItem('savedListings') || '[]');

  listings.forEach(listing => {
    const avail = new Date(listing.available);
    const availStr = avail.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const tenants = listing.maxTenants || 1;
    const weeklyPP = Math.round(listing.price * 12 / 52 / tenants);
    const isSaved = saved.includes(listing.id);
    const isRented = listing.status === 'rented';

    const card = document.createElement('div');
    card.className = 'listing-card';
    card.onclick = () => location.href = 'listing.html?id=' + listing.id;

    const photoContent = listing.photos && listing.photos.length > 0
      ? `<img class="listing-photo" src="${listing.photos[0]}" alt="${listing.title}" style="${isRented ? 'filter:blur(3px)' : ''}">`
      : `<div class="listing-photo-placeholder">🏠</div>`;

    const rentedBadge = isRented
      ? `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.65);color:white;font-size:13px;font-weight:600;padding:8px 18px;border-radius:20px;">Already Rented</div>`
      : '';

    card.innerHTML = `
      <div class="listing-photo-wrap">
        ${photoContent}
        ${rentedBadge}
        <button class="save-btn" data-id="${listing.id}" onclick="event.stopPropagation(); toggleSave(this, '${listing.id}')">${isSaved ? '❤️' : '🤍'}</button>
        <div class="available-badge">${isRented ? 'Rented' : 'Available ' + availStr}</div>
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

if (document.getElementById('listings-container')) {
  loadListings();
}
