import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, PortfolioItem } from '../lib/supabase';
import {
  LogOut,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Video,
  X,
  Check,
} from 'lucide-react';

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Flyers',
    is_featured: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = [
    'Flyers',
    'Logos',
    'Brochures',
    'Banners',
    'T-Shirts',
    'Branding',
    'Printing',
    'Installations',
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(filePath);

      const mediaType = file.type.startsWith('video/') ? 'video' : 'image';

      const { error: dbError } = await supabase
        .from('portfolio_items')
        .insert([
          {
            ...formData,
            media_url: publicUrl,
            media_type: mediaType,
          },
        ]);

      if (dbError) throw dbError;

      setMessage({ type: 'success', text: 'Item uploaded successfully!' });
      setFormData({
        title: '',
        description: '',
        category: 'Flyers',
        is_featured: false,
      });
      setFile(null);
      setShowForm(false);
      fetchItems();
    } catch (error) {
      console.error('Error uploading:', error);
      setMessage({ type: 'error', text: 'Failed to upload item' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, mediaUrl: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const filePath = mediaUrl.split('/').pop();
      if (filePath) {
        await supabase.storage.from('portfolio-media').remove([filePath]);
      }

      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Item deleted successfully!' });
      fetchItems();
    } catch (error) {
      console.error('Error deleting:', error);
      setMessage({ type: 'error', text: 'Failed to delete item' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-red-600" />
            )}
            <p
              className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}
            >
              {message.text}
            </p>
          </div>
        )}

        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <Plus size={20} />
            Add New Item
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File (Image or Video)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-600 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Images and videos up to 50MB
                    </p>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.is_featured}
                  onChange={(e) =>
                    setFormData({ ...formData, is_featured: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Feature on homepage
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload Item'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Portfolio Items ({items.length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No items yet. Add your first item!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-video bg-gray-100">
                    {item.media_type === 'image' ? (
                      <>
                        <img
                          src={item.media_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <ImageIcon className="absolute top-2 left-2 w-6 h-6 text-white bg-black bg-opacity-50 rounded p-1" />
                      </>
                    ) : (
                      <>
                        <video src={item.media_url} className="w-full h-full object-cover" />
                        <Video className="absolute top-2 left-2 w-6 h-6 text-white bg-black bg-opacity-50 rounded p-1" />
                      </>
                    )}
                    {item.is_featured && (
                      <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      <button
                        onClick={() => handleDelete(item.id, item.media_url)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
