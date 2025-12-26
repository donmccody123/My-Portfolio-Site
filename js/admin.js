// Admin dashboard functionality
import { supabase } from './supabase.js';
import { signOut, onAuthStateChange } from './auth.js';
import { refreshPortfolio } from './portfolio.js';

let items = [];
let showForm = false;
let editingItemId = null;

// Initialize admin dashboard
export function initAdmin() {
  onAuthStateChange((user) => {
    if (user) {
      renderAdminDashboard();
      fetchItems();
    }
  });
}

// Render admin dashboard HTML
function renderAdminDashboard() {
  const adminDashboard = document.getElementById('admin-dashboard');
  adminDashboard.innerHTML = `
    <nav class="admin-nav">
      <div class="admin-nav-content">
        <h1 class="admin-title">
          Admin Dashboard
        </h1>
        <button
          onclick="handleSignOut()"
          class="btn-signout"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </nav>

    <div class="section-content" style="padding-top: 2rem; padding-bottom: 2rem;">
      <div id="admin-message" class="hidden mb-6 p-4 rounded-lg flex items-center gap-3"></div>

      <div class="mb-8">
        <button
          onclick="toggleAdminForm()"
          class="btn-add-item"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Item
        </button>
      </div>

      <div id="admin-form" class="admin-form hidden">
        <h2 class="text-2xl font-bold text-gray-900 mb-6" id="form-title">Add New Portfolio Item</h2>
        <form onsubmit="handleAdminSubmit(event)" class="space-y-6">
          <div class="admin-form-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
            <div class="form-group">
              <label class="form-label">
                Title
              </label>
              <input
                type="text"
                id="admin-title"
                class="form-input-admin"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                Category
              </label>
              <select
                id="admin-category"
                class="form-input-admin"
              >
                <option value="Flyers">Flyers</option>
                <option value="Logos">Logos</option>
                <option value="Brochures">Brochures</option>
                <option value="Banners">Banners</option>
                <option value="T-Shirts">T-Shirts</option>
                <option value="Branding">Branding</option>
                <option value="Printing">Printing</option>
                <option value="Installations">Installations</option>
                <option value="Case Studies">Case Studies</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              Description
            </label>
            <textarea
              id="admin-description"
              rows="3"
              class="form-input-admin"
            ></textarea>
          </div>

          <div class="form-group">
              <label class="form-label">
                Upload Files (Images or Videos)
              </label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-600 transition-colors">
              <input
                type="file"
                id="admin-file"
                multiple
                onchange="handleAdminFileChange(event)"
                accept="image/*,video/*"
                class="hidden"
              />
                  <label for="admin-file" id="admin-file-label" class="cursor-pointer">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-gray-600" id="admin-file-name">
                  Click to upload or drag and drop (multiple allowed)
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  Images and videos up to 50MB each
                </p>
              </label>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              id="admin-featured"
              class="w-4 h-4 text-blue-600 rounded"
            />
            <label for="admin-featured" class="text-sm font-medium text-gray-700">
              Feature on homepage
            </label>
          </div>

          <div class="flex gap-4">
            <button
              type="submit"
              id="admin-submit"
              class="btn-upload"
            >
              <span id="submit-btn-text">Upload Item</span>
            </button>
            <button
              type="button"
              onclick="toggleAdminForm()"
              class="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div class="admin-form">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          Portfolio Items (<span id="admin-items-count">0</span>)
        </h2>

        <div id="admin-loading" class="text-center py-12">
          <div class="loading-spinner"></div>
        </div>

        <div id="admin-empty" class="hidden text-center py-12">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-gray-600">No items yet. Add your first item!</p>
        </div>

        <div id="admin-items-grid" class="admin-items-grid">
          <!-- Items will be rendered here -->
        </div>
      </div>
    </div>
  `;
}

// Fetch admin items
async function fetchItems() {
  try {
    const adminLoading = document.getElementById('admin-loading');
    const adminEmpty = document.getElementById('admin-empty');
    const adminItemsGrid = document.getElementById('admin-items-grid');
    const adminItemsCount = document.getElementById('admin-items-count');

    adminLoading.classList.remove('hidden');
    adminEmpty.classList.add('hidden');
    adminItemsGrid.innerHTML = '';

    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    items = data || [];
    adminItemsCount.textContent = items.length;
    adminLoading.classList.add('hidden');

    if (items.length === 0) {
      adminEmpty.classList.remove('hidden');
    } else {
      renderAdminItems();
    }
  } catch (error) {
    console.error('Error fetching items:', error);
    showMessage('error', 'Failed to load items');
  }
}

// Render admin items
function renderAdminItems() {
  const adminItemsGrid = document.getElementById('admin-items-grid');
  const adminEmpty = document.getElementById('admin-empty');

  if (items.length === 0) {
    adminEmpty.classList.remove('hidden');
    adminItemsGrid.innerHTML = '';
    return;
  }

  adminEmpty.classList.add('hidden');
  adminItemsGrid.innerHTML = items.map(item => `
    <div class="admin-item-card">
      <div class="portfolio-item-image">
        ${item.media_type === 'image' ? `
          <img
            src="${item.media_url}"
            alt="${item.title}"
          />
        ` : `
          <video src="${item.media_url}" class="w-full h-full object-cover"></video>
        `}
        ${Array.isArray(item.media_gallery) && item.media_gallery.length > 1 ? `
          <span class="gallery-pill">${item.media_gallery.length} files</span>
        ` : ''}
        ${item.is_featured ? `
          <span class="absolute top-2 right-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded">
            Featured
          </span>
        ` : ''}
      </div>
      <div class="p-4">
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-bold text-gray-900">${item.title}</h3>
          <div class="flex gap-3 items-center">
            <button
              onclick="handleAdminEdit('${item.id}')"
              class="btn-edit flex items-center gap-1"
              title="Edit item"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span class="btn-edit-label">Edit</span>
            </button>
            <button
              onclick="handleAdminDelete('${item.id}', '${item.media_url}')"
              class="btn-delete flex items-center gap-1"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span class="btn-delete-label">Delete</span>
            </button>
          </div>
        </div>
        <p class="text-sm text-gray-600 mb-2 line-clamp-2">
          ${item.description}
        </p>
        <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
          ${item.category}
        </span>
      </div>
    </div>
  `).join('');
}

// Handle admin edit
export function handleAdminEdit(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  editingItemId = id;
  showForm = true;

  // Populate form with item data
  document.getElementById('admin-title').value = item.title;
  document.getElementById('admin-description').value = item.description;
  document.getElementById('admin-category').value = item.category;
  document.getElementById('admin-featured').checked = item.is_featured || false;
  document.getElementById('form-title').textContent = 'Edit Portfolio Item';
  document.getElementById('submit-btn-text').textContent = 'Update Item';
  // Show file input section for optional media replacement
  const fileSection = document.getElementById('admin-file').closest('.form-group');
  const fileLabel = document.getElementById('admin-file-label');
  if (fileSection) {
    fileSection.style.display = 'block';
  }
  if (fileLabel) {
    fileLabel.querySelector('#admin-file-name').textContent = 'Click to replace media or drag and drop (optional)';
  }

  const form = document.getElementById('admin-form');
  form.classList.remove('hidden');

  // Scroll to form
  form.scrollIntoView({ behavior: 'smooth' });
}

// Handle admin form submit
export async function handleAdminSubmit(event) {
  event.preventDefault();

  const title = document.getElementById('admin-title').value;
  const description = document.getElementById('admin-description').value;
  const category = document.getElementById('admin-category').value;
  const isFeatured = document.getElementById('admin-featured').checked;
  const fileInput = document.getElementById('admin-file');
  const submitBtn = document.getElementById('admin-submit');

  // If editing, optionally allow media replacement
  if (editingItemId) {
    // Update existing item
    submitBtn.disabled = true;
    submitBtn.textContent = 'Updating...';

    try {
      const currentItem = items.find(i => i.id === editingItemId);

      let updatePayload = {
        title,
        description,
        category,
        is_featured: isFeatured,
      };

      if (fileInput.files && fileInput.files.length > 0) {
        // Upload new files and replace media
        const uploads = [];
        const files = Array.from(fileInput.files);
        for (const file of files) {
          const ext = file.name.split('.').pop();
          const name = `${Math.random().toString(36).substring(2)}-${Date.now()}.${ext}`;
          const path = `${name}`;
          const { error: uploadError } = await supabase.storage
            .from('portfolio-media')
            .upload(path, file);
          if (uploadError) throw uploadError;
          const { data: { publicUrl } } = supabase.storage
            .from('portfolio-media')
            .getPublicUrl(path);
          uploads.push({ url: publicUrl, type: file.type.startsWith('video/') ? 'video' : 'image', path });
        }

        const primary = uploads[0];
        const gallery = uploads.map(u => ({ url: u.url, type: u.type, path: u.path }));

        updatePayload.media_url = primary.url;
        updatePayload.media_type = primary.type;
        updatePayload.media_gallery = gallery;

        // Remove old media files from storage (primary + gallery)
        const paths = [];
        const primaryPath = currentItem.media_url?.split('/').pop();
        if (primaryPath) paths.push(primaryPath);
        if (Array.isArray(currentItem.media_gallery)) {
          currentItem.media_gallery.forEach(entry => {
            const p = entry?.url?.split('/').pop();
            if (p) paths.push(p);
          });
        }
        const uniquePaths = [...new Set(paths)];
        if (uniquePaths.length > 0) {
          await supabase.storage.from('portfolio-media').remove(uniquePaths);
        }
      }

      const { error: dbError } = await supabase
        .from('portfolio_items')
        .update(updatePayload)
        .eq('id', editingItemId);

      if (dbError) throw dbError;

      showMessage('success', 'Item updated successfully!');
      
      // Reset form
      resetAdminForm();
      editingItemId = null;
      toggleAdminForm();
      
      await fetchItems();
      await refreshPortfolio();
    } catch (error) {
      console.error('Error updating:', error);
      showMessage('error', 'Failed to update item');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Update Item';
    }
  } else {
    // Create new item
    if (!fileInput.files || fileInput.files.length === 0) {
      showMessage('error', 'Please select at least one file');
      return;
    }

    const files = Array.from(fileInput.files);
    submitBtn.disabled = true;
    submitBtn.textContent = 'Uploading...';

    try {
      // Upload all files sequentially (simpler error handling)
      const uploads = [];
      for (const file of files) {
        const ext = file.name.split('.').pop();
        const name = `${Math.random().toString(36).substring(2)}-${Date.now()}.${ext}`;
        const path = `${name}`;
        const { error: uploadError } = await supabase.storage
          .from('portfolio-media')
          .upload(path, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage
          .from('portfolio-media')
          .getPublicUrl(path);
        uploads.push({ url: publicUrl, type: file.type.startsWith('video/') ? 'video' : 'image', path });
      }

      const primary = uploads[0];
      const gallery = uploads.map(u => ({ url: u.url, type: u.type, path: u.path }));

      const { error: dbError } = await supabase
        .from('portfolio_items')
        .insert([
          {
            title,
            description,
            category,
            media_url: primary.url,
            media_type: primary.type,
            media_gallery: gallery,
            is_featured: isFeatured,
          },
        ]);

      if (dbError) throw dbError;

      showMessage('success', 'Item uploaded successfully!');
      
      // Reset form
      resetAdminForm();
      toggleAdminForm();
      
      await fetchItems();
      await refreshPortfolio();
    } catch (error) {
      console.error('Error uploading:', error);
      showMessage('error', 'Failed to upload item');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Upload Item';
    }
  }
}

// Reset admin form
function resetAdminForm() {
  document.getElementById('admin-title').value = '';
  document.getElementById('admin-description').value = '';
  document.getElementById('admin-category').value = 'Flyers';
  document.getElementById('admin-featured').checked = false;
  document.getElementById('admin-file').value = '';
  document.getElementById('admin-file-name').textContent = 'Click to upload or drag and drop (multiple allowed)';
  document.getElementById('form-title').textContent = 'Add New Portfolio Item';
  document.getElementById('submit-btn-text').textContent = 'Upload Item';
  
  // Show file input section again
  const fileSection = document.getElementById('admin-file').closest('.form-group');
  if (fileSection) {
    fileSection.style.display = 'block';
  }
  
  editingItemId = null;
}

// Handle admin file change
export function handleAdminFileChange(event) {
  const file = event.target.files[0];
  const fileName = document.getElementById('admin-file-name');
  if (file) {
    const count = event.target.files.length;
    fileName.textContent = count === 1 ? file.name : `${file.name} (+${count - 1} more)`;
  } else {
    fileName.textContent = 'Click to upload or drag and drop (multiple allowed)';
  }
}

// Handle admin delete
export async function handleAdminDelete(id, mediaUrl) {
  if (!confirm('Are you sure you want to delete this item?')) return;

  try {
    const targetItem = items.find(i => i.id === id);

    // Collect all file paths to remove (primary + gallery)
    const paths = [];
    const primaryPath = mediaUrl.split('/').pop();
    if (primaryPath) paths.push(primaryPath);
    if (targetItem && Array.isArray(targetItem.media_gallery)) {
      targetItem.media_gallery.forEach(entry => {
        const p = entry?.url?.split('/').pop();
        if (p) paths.push(p);
      });
    }

    const uniquePaths = [...new Set(paths)];
    if (uniquePaths.length > 0) {
      await supabase.storage.from('portfolio-media').remove(uniquePaths);
    }

    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    showMessage('success', 'Item deleted successfully!');
    await fetchItems();
    await refreshPortfolio();
  } catch (error) {
    console.error('Error deleting:', error);
    showMessage('error', 'Failed to delete item');
  }
}

// Toggle admin form
export function toggleAdminForm() {
  showForm = !showForm;
  const form = document.getElementById('admin-form');
  if (showForm) {
    form.classList.remove('hidden');
  } else {
    form.classList.add('hidden');
    if (!editingItemId) {
      resetAdminForm();
    }
  }
}

// Handle sign out
export async function handleSignOut() {
  try {
    await signOut();
    window.location.reload();
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

// Show message
function showMessage(type, text) {
  const messageDiv = document.getElementById('admin-message');
  messageDiv.className = `mb-6 p-4 rounded-lg flex items-center gap-3 ${
    type === 'success'
      ? 'bg-green-50 border border-green-200'
      : 'bg-red-50 border border-red-200'
  }`;
  
  messageDiv.innerHTML = `
    ${type === 'success' ? `
      <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    ` : `
      <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    `}
    <p class="${type === 'success' ? 'text-green-800' : 'text-red-800'}">
      ${text}
    </p>
  `;
  
  messageDiv.classList.remove('hidden');
  
  setTimeout(() => {
    messageDiv.classList.add('hidden');
  }, 5000);
}

// Make functions available globally
window.handleAdminSubmit = handleAdminSubmit;
window.handleAdminFileChange = handleAdminFileChange;
window.handleAdminDelete = handleAdminDelete;
window.handleAdminEdit = handleAdminEdit;
window.toggleAdminForm = toggleAdminForm;
window.handleSignOut = handleSignOut;

