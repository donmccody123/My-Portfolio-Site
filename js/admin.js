// Admin dashboard functionality
import { supabase } from './supabase.js';
import { signOut, onAuthStateChange } from './auth.js';
import { refreshPortfolio } from './portfolio.js';

let items = [];
let showForm = false;
let editingItemId = null;
let selectedFiles = [];
let dragSrcIndex = null;
let currentGallery = [];
let originalGalleryPaths = [];

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
                <div id="admin-media-preview" class="admin-media-preview"></div>
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

  // Show current media previews
  // Initialize current gallery state for reordering
  currentGallery = (Array.isArray(item.media_gallery) && item.media_gallery.length)
    ? item.media_gallery.map(entry => ({
        url: entry.url,
        type: entry.type,
        path: entry.path || (entry.url ? entry.url.split('/').pop() : undefined)
      }))
    : [{
        url: item.media_url,
        type: item.media_type,
        path: item.media_url ? item.media_url.split('/').pop() : undefined
      }];

  originalGalleryPaths = currentGallery.map(e => e.path).filter(Boolean);

  renderAdminPreviewFromItem();

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

  // If editing, allow media addition and reorder/removal without replacing existing unless removed
  if (editingItemId) {
    // Update existing item
    submitBtn.disabled = true;
    submitBtn.textContent = 'Updating...';

    try {
      const currentItem = items.find(i => i.id === editingItemId);

      // Upload any new files embedded in currentGallery (entries holding a File)
      for (let i = 0; i < currentGallery.length; i++) {
        const entry = currentGallery[i];
        if (entry.file) {
          const file = entry.file;
          const ext = file.name.split('.').pop();
          const name = `${Math.random().toString(36).substring(2)}-${Date.now()}.${ext}`;
          const path = `${name}`;
          
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('portfolio-media')
            .upload(path, file);
          
          if (uploadError) {
            console.error('Upload error:', uploadError);
            throw uploadError;
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('portfolio-media')
            .getPublicUrl(path);
          
          entry.url = publicUrl;
          entry.type = file.type.startsWith('video/') ? 'video' : 'image';
          entry.path = path;
          delete entry.file;
          delete entry.isNew;
        }
      }

      let updatePayload = {
        title,
        description,
        category,
        is_featured: isFeatured,
      };

      if (currentGallery && currentGallery.length > 0) {
        // Validate all entries have URLs
        const hasInvalidEntries = currentGallery.some(e => !e.url);
        if (hasInvalidEntries) {
          throw new Error('Some media files failed to upload. Please try again.');
        }

        const primary = currentGallery[0];
        updatePayload.media_url = primary.url;
        updatePayload.media_type = primary.type;
        updatePayload.media_gallery = currentGallery.map(e => ({ url: e.url, type: e.type, path: e.path }));

        const currentPaths = currentGallery.map(e => e.path).filter(Boolean);
        const removedPaths = originalGalleryPaths.filter(p => !currentPaths.includes(p));
        if (removedPaths.length > 0) {
          try {
            await supabase.storage.from('portfolio-media').remove(removedPaths);
          } catch (remErr) {
            console.warn('Failed to remove some files from storage:', remErr);
          }
        }
      }

      const { error: dbError } = await supabase
        .from('portfolio_items')
        .update(updatePayload)
        .eq('id', editingItemId);

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      showMessage('success', 'Item updated successfully!');
      
      // Reset form
      resetAdminForm();
      editingItemId = null;
      toggleAdminForm();
      
      await fetchItems();
      await refreshPortfolio();
    } catch (error) {
      console.error('Error updating:', error);
      const errorMsg = error.message || 'Failed to update item';
      showMessage('error', errorMsg);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Update Item';
    }
  } else {
    // Create new item
    if (!selectedFiles || selectedFiles.length === 0) {
      showMessage('error', 'Please select at least one file');
      return;
    }

    const files = selectedFiles;
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
  const titleEl = document.getElementById('admin-title');
  const descEl = document.getElementById('admin-description');
  const categoryEl = document.getElementById('admin-category');
  const featuredEl = document.getElementById('admin-featured');
  const fileEl = document.getElementById('admin-file');
  const fileNameEl = document.getElementById('admin-file-name');
  const formTitleEl = document.getElementById('form-title');
  const submitBtnTextEl = document.getElementById('submit-btn-text');
  
  if (titleEl) titleEl.value = '';
  if (descEl) descEl.value = '';
  if (categoryEl) categoryEl.value = 'Flyers';
  if (featuredEl) featuredEl.checked = false;
  if (fileEl) fileEl.value = '';
  if (fileNameEl) fileNameEl.textContent = 'Click to upload or drag and drop (multiple allowed)';
  if (formTitleEl) formTitleEl.textContent = 'Add New Portfolio Item';
  if (submitBtnTextEl) submitBtnTextEl.textContent = 'Upload Item';
  
  // Show file input section again
  if (fileEl) {
    const fileSection = fileEl.closest('.form-group');
    if (fileSection) {
      fileSection.style.display = 'block';
    }
  }
  const preview = document.getElementById('admin-media-preview');
  if (preview) preview.innerHTML = '';
  
  selectedFiles = [];
  editingItemId = null;
  currentGallery = [];
  originalGalleryPaths = [];
}

// Render admin preview from existing item media
function renderAdminPreviewFromItem() {
  const preview = document.getElementById('admin-media-preview');
  if (!preview) return;
  const html = (currentGallery || []).map((media, idx) => `
    <div class="preview-item" draggable="true"
         ondragstart="window.handleCurrentDragStart(event, ${idx})"
         ondragover="window.handleCurrentDragOver(event, ${idx})"
         ondragleave="window.handleCurrentDragLeave(event, ${idx})"
         ondrop="window.handleCurrentDrop(event, ${idx})"
         ondragend="window.handleCurrentDragEnd(event)">
      ${media.type === 'video'
        ? `<video src="${media.url}" class="preview-video" controls muted></video>`
        : `<img src="${media.url}" class="preview-image" alt="Current media preview" />`
      }
      <div class="preview-actions">
        <button class="preview-btn danger" title="Remove from gallery" onclick="event.stopPropagation(); window.removeCurrentMedia(${idx})">✕</button>
      </div>
      <span class="preview-type">${media.type === 'video' ? 'Video' : 'Image'}</span>
    </div>
  `).join('');
  preview.innerHTML = html;
}

// Handle admin file change
export function handleAdminFileChange(event) {
  const files = Array.from(event.target.files || []);

  // If editing, append new files to current gallery instead of replacing
  if (editingItemId) {
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      currentGallery.push({
        url,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        path: null,
        file,
        isNew: true,
      });
    });
    renderAdminPreviewFromItem();
    // Clear input so the same file can be selected again if needed
    event.target.value = '';
    return;
  }

  // Create mode: maintain existing selectedFiles flow
  selectedFiles = files;
  renderSelectedPreviews();
}

function renderSelectedPreviews() {
  const fileName = document.getElementById('admin-file-name');
  const preview = document.getElementById('admin-media-preview');
  const fileInput = document.getElementById('admin-file');

  if (!preview || !fileInput) return;

  if (selectedFiles.length > 0) {
    fileName.textContent = selectedFiles.length === 1 ? selectedFiles[0].name : `${selectedFiles[0].name} (+${selectedFiles.length - 1} more)`;

    const html = selectedFiles.map((file, idx) => {
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/');
      return `
        <div class="preview-item" draggable="true"
             ondragstart="window.handlePreviewDragStart(event, ${idx})"
             ondragover="window.handlePreviewDragOver(event, ${idx})"
             ondragleave="window.handlePreviewDragLeave(event, ${idx})"
             ondrop="window.handlePreviewDrop(event, ${idx})"
             ondragend="window.handlePreviewDragEnd(event)">
          ${isVideo
            ? `<video src="${url}" class="preview-video" controls muted></video>`
            : `<img src="${url}" class="preview-image" alt="Selected media preview" />`
          }
          <div class="preview-actions">
            <button class="preview-btn" title="Move up" onclick="event.stopPropagation(); window.moveSelectedFile(${idx}, -1)">▲</button>
            <button class="preview-btn" title="Move down" onclick="event.stopPropagation(); window.moveSelectedFile(${idx}, 1)">▼</button>
            <button class="preview-btn danger" title="Remove" onclick="event.stopPropagation(); window.removeSelectedFile(${idx})">✕</button>
          </div>
          <span class="preview-type">${isVideo ? 'Video' : 'Image'}</span>
        </div>
      `;
    }).join('');
    preview.innerHTML = html;

    const dt = new DataTransfer();
    selectedFiles.forEach(f => dt.items.add(f));
    fileInput.files = dt.files;
  } else {
    fileName.textContent = 'Click to upload or drag and drop (multiple allowed)';
    preview.innerHTML = '';
    const dt = new DataTransfer();
    fileInput.files = dt.files;
  }
}

function removeSelectedFile(index) {
  selectedFiles.splice(index, 1);
  renderSelectedPreviews();
}

function moveSelectedFile(index, delta) {
  const newIndex = index + delta;
  if (newIndex < 0 || newIndex >= selectedFiles.length) return;
  const [file] = selectedFiles.splice(index, 1);
  selectedFiles.splice(newIndex, 0, file);
  renderSelectedPreviews();
}

function handlePreviewDragStart(e, index) {
  dragSrcIndex = index;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', String(index));
  const el = e.currentTarget;
  if (el) el.classList.add('dragging');
}

function handlePreviewDragOver(e, index) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  const el = e.currentTarget;
  if (el) el.classList.add('drag-over');
}

function handlePreviewDragLeave(e) {
  const el = e.currentTarget;
  if (el) el.classList.remove('drag-over');
}

function handlePreviewDrop(e, targetIndex) {
  e.preventDefault();
  const el = e.currentTarget;
  if (el) el.classList.remove('drag-over');

  const srcIndexStr = e.dataTransfer.getData('text/plain');
  const srcIndex = dragSrcIndex != null ? dragSrcIndex : (srcIndexStr ? parseInt(srcIndexStr, 10) : null);
  dragSrcIndex = null;
  if (srcIndex == null || srcIndex === targetIndex) return;

  const [file] = selectedFiles.splice(srcIndex, 1);
  selectedFiles.splice(targetIndex, 0, file);
  renderSelectedPreviews();
}

function handlePreviewDragEnd(e) {
  const el = e.currentTarget;
  if (el) el.classList.remove('dragging');
}

// Drag-and-drop for current gallery reordering
let currentDragSrcIndex = null;

function handleCurrentDragStart(e, index) {
  currentDragSrcIndex = index;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', String(index));
  const el = e.currentTarget;
  if (el) el.classList.add('dragging');
}

function handleCurrentDragOver(e, index) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  const el = e.currentTarget;
  if (el) el.classList.add('drag-over');
}

function handleCurrentDragLeave(e) {
  const el = e.currentTarget;
  if (el) el.classList.remove('drag-over');
}

function handleCurrentDrop(e, targetIndex) {
  e.preventDefault();
  const el = e.currentTarget;
  if (el) el.classList.remove('drag-over');

  const srcIndexStr = e.dataTransfer.getData('text/plain');
  const srcIndex = currentDragSrcIndex != null ? currentDragSrcIndex : (srcIndexStr ? parseInt(srcIndexStr, 10) : null);
  currentDragSrcIndex = null;
  if (srcIndex == null || srcIndex === targetIndex) return;

  const [entry] = currentGallery.splice(srcIndex, 1);
  currentGallery.splice(targetIndex, 0, entry);
  renderAdminPreviewFromItem();
}

function handleCurrentDragEnd(e) {
  const el = e.currentTarget;
  if (el) el.classList.remove('dragging');
}

function removeCurrentMedia(index) {
  if (!Array.isArray(currentGallery)) return;
  if (currentGallery.length <= 1) {
    showMessage('error', 'At least one media must remain.');
    return;
  }
  currentGallery.splice(index, 1);
  renderAdminPreviewFromItem();
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
    // Reset form when opening for new item
    if (!editingItemId) {
      resetAdminForm();
    }
    form.classList.remove('hidden');
  } else {
    form.classList.add('hidden');
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
window.removeSelectedFile = removeSelectedFile;
window.moveSelectedFile = moveSelectedFile;
window.handlePreviewDragStart = handlePreviewDragStart;
window.handlePreviewDragOver = handlePreviewDragOver;
window.handlePreviewDragLeave = handlePreviewDragLeave;
window.handlePreviewDrop = handlePreviewDrop;
window.handlePreviewDragEnd = handlePreviewDragEnd;
window.removeCurrentMedia = removeCurrentMedia;
window.removeCurrentMedia = removeCurrentMedia;
window.handleCurrentDragStart = handleCurrentDragStart;
window.handleCurrentDragOver = handleCurrentDragOver;
window.handleCurrentDragLeave = handleCurrentDragLeave;
window.handleCurrentDrop = handleCurrentDrop;
window.handleCurrentDragEnd = handleCurrentDragEnd;

