import { useEffect, useState } from 'react';
import { supabase, PortfolioItem } from '../lib/supabase';
import { Play, Image as ImageIcon } from 'lucide-react';

const categories = [
  'All',
  'Flyers',
  'Logos',
  'Brochures',
  'Banners',
  'T-Shirts',
  'Branding',
  'Printing',
  'Installations',
];

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item =>
        item.category.toLowerCase() === activeCategory.toLowerCase()
      ));
    }
  }, [activeCategory, items]);

  const fetchPortfolioItems = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
      setFilteredItems(data || []);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            My Portfolio
          </h2>
          <p className="text-xl text-gray-600">
            Explore my creative work across various design disciplines
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading portfolio...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No items in this category yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  {item.media_type === 'image' ? (
                    <img
                      src={item.media_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
                      <video
                        src={item.media_url}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all">
                        <Play className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {selectedItem.media_type === 'image' ? (
                <img
                  src={selectedItem.media_url}
                  alt={selectedItem.title}
                  className="w-full max-h-[60vh] object-contain"
                />
              ) : (
                <video
                  src={selectedItem.media_url}
                  controls
                  className="w-full max-h-[60vh]"
                />
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h3>
                <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                  {selectedItem.category}
                </span>
              </div>
              <p className="text-gray-600">{selectedItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
