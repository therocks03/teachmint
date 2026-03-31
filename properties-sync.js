// ===== SHARED PROPERTIES DATA HANDLER =====
// This file ensures properties sync across admin.html, property.html, and index.html

(function() {
  'use strict';
  
  const STORAGE_KEY = 'jdh_properties';
  
  // ===== GET PROPERTIES =====
  window.getProperties = function() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const properties = JSON.parse(stored);
      
      // Filter only active/published properties for public pages
      return properties.filter(p => 
        p.status === 'active' || 
        p.status === 'hot' || 
        p.status === 'published' ||
        p.status === 'Available' ||
        p.status === '🔥 Hot Deal'
      );
    } catch (e) {
      console.error('Error loading properties:', e);
      return [];
    }
  };
  
  // ===== GET LATEST N PROPERTIES =====
  window.getLatestProperties = function(count = 6) {
    const properties = getProperties();
    return properties
      .sort((a, b) => (b.id || 0) - (a.id || 0))
      .slice(0, count);
  };
  
  // ===== FORMAT PROPERTY FOR DISPLAY =====
  window.formatProperty = function(property) {
    return {
      id: property.id,
      name: property.name || 'Untitled Property',
      location: property.location || 'Jaipur',
      price: property.price || 'Contact for Price',
      type: property.type || 'Residential Plot',
      tag: property.tag || property.type || 'Property',
      status: property.status || 'active',
      description: property.desc || property.description || '',
      excerpt: (property.desc || property.description || '').substring(0, 150) + '...',
      imageUrl: property.img || property.imageUrl || 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
      plotSize: property.size || property.plotSize || 'Contact for details',
      amenities: property.amenities || [],
      rera: property.rera || '',
      possession: property.possession || 'Contact for details',
      waMsg: property.waMsg || `Hi, I am interested in ${property.name}`
    };
  };
  
  // ===== RENDER PROPERTIES TO GRID (FOR INDEX.HTML) =====
  window.renderFeaturedProperties = function() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) {
      console.log('Projects grid not found - not on home page');
      return;
    }
    
    const featured = getLatestProperties(4); // Top 4 for home page
    
    if (!featured.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--muted)"><p>No properties available at the moment.</p></div>';
      return;
    }
    
    grid.innerHTML = featured.map((p, i) => {
      const prop = formatProperty(p);
      
      if (i === 0) {
        // First property - Featured card
        return `
          <div class="project-featured">
            <div class="pf-img">
              <img src="${prop.imageUrl}" alt="${prop.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80'">
            </div>
            <div class="pf-body">
              <div class="pf-tag">${prop.tag}</div>
              <div class="pf-title">${prop.name}</div>
              <div class="pf-location">${prop.location}</div>
              <div class="pf-excerpt">${prop.excerpt}</div>
              <div class="pf-meta">
                <span>📍 ${prop.location.replace('📍', '').trim()}</span>
                <span>📐 ${prop.plotSize}</span>
                <span>💰 ${prop.price}</span>
              </div>
              <a href="property.html?id=${prop.id}" class="project-btn">View Details →</a>
            </div>
          </div>
        `;
      } else {
        // Regular cards
        return `
          <a href="property.html?id=${prop.id}" class="project-card">
            <div class="pc-img">
              <img src="${prop.imageUrl}" alt="${prop.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80'">
              <div class="pc-tag">${prop.tag}</div>
            </div>
            <div class="pc-body">
              <div class="pc-title">${prop.name}</div>
              <div class="pc-location">${prop.location}</div>
              <div class="pc-excerpt">${prop.excerpt}</div>
              <div class="pc-footer">
                <div class="pc-price">${prop.price}</div>
                <div class="pc-link">Details →</div>
              </div>
            </div>
          </a>
        `;
      }
    }).join('');
    
    console.log('✅ Featured properties rendered:', featured.length);
  };
  
  // ===== LISTEN FOR STORAGE CHANGES =====
  window.addEventListener('storage', function(e) {
    if (e.key === STORAGE_KEY) {
      console.log('Properties updated in localStorage, refreshing...');
      
      // Reload properties on current page
      if (typeof renderFeaturedProperties === 'function') {
        renderFeaturedProperties();
      }
      if (typeof renderListing === 'function') {
        renderListing();
      }
    }
  });
  
  console.log('✅ Properties sync system loaded');
})();
