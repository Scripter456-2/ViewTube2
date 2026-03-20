// ViewTube - Shared Utilities

// --- Data Loading ---
async function loadJSON(path) {
  try {
    // Support both local and GitHub Pages paths
    const base = window.location.pathname.includes('/viewtube') 
      ? window.location.pathname.split('/viewtube')[0] + '/viewtube/' 
      : './';
    const response = await fetch(base + path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return await response.json();
  } catch (e) {
    console.warn('Load failed, returning empty array:', e);
    return [];
  }
}

// --- Verified Badge ---
function getBadgeHTML(channel, size = '') {
  const cls = `badge ${size}`;
  if (channel.IsBlackVerified) {
    return `<span class="${cls} badge-black" title="Official Creator">✓</span>`;
  }
  if (channel.IsGoldVerified) {
    return `<span class="${cls} badge-gold" title="Gold Verified">★</span>`;
  }
  if (channel.IsVerified) {
    return `<span class="${cls} badge-verified" title="Verified">✓</span>`;
  }
  return '';
}

// --- Format Numbers ---
function formatViews(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}

// --- Video Card ---
function buildVideoCard(video, channel) {
  const card = document.createElement('div');
  card.className = 'video-card';
  card.innerHTML = `
    <div class="video-thumb">
      <img src="${video.thumbnail}" alt="${escapeHTML(video.title)}" loading="lazy">
      <div class="video-play-overlay">
        <div class="play-btn-overlay">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
        </div>
      </div>
      <span class="video-duration">${video.duration}</span>
    </div>
    <div class="video-info">
      <div class="channel-avatar">
        <img src="${channel ? channel.avatar : ''}" alt="${channel ? channel.name : ''}" loading="lazy">
      </div>
      <div class="video-meta">
        <div class="video-title">${escapeHTML(video.title)}</div>
        <a class="video-channel" href="#">
          ${channel ? escapeHTML(channel.name) : 'Unknown'}
          ${channel ? getBadgeHTML(channel) : ''}
        </a>
        <div class="video-stats">${formatViews(video.views)} views &middot; ${video.uploadedAgo}</div>
      </div>
    </div>
  `;
  card.addEventListener('click', () => {
    window.location.href = `watch.html?v=${video.id}`;
  });
  return card;
}

// --- Escape HTML ---
function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str || ''));
  return div.innerHTML;
}

// --- Toast ---
function showToast(msg, type = 'info') {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  toast.className = `toast ${type} show`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// --- URL Params ---
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// --- Sidebar toggle ---
function initSidebarToggle() {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.toggle('mobile-open');
      } else {
        sidebar.classList.toggle('hidden');
        const main = document.querySelector('.main');
        if (main) main.classList.toggle('no-sidebar');
      }
    });
  }
}

// --- Active Sidebar Link ---
function setActiveSidebarLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-item[data-page]').forEach(el => {
    if (el.dataset.page === page) el.classList.add('active');
  });
}

// --- Init Search ---
function initSearch() {
  const input = document.querySelector('.search-input');
  const btn = document.querySelector('.search-btn');
  const doSearch = () => {
    const q = input?.value.trim();
    if (q) showToast(`Searching for "${q}"…`, 'info');
  };
  btn?.addEventListener('click', doSearch);
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
}
