'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Plus, Pencil, Trash2, LogOut, Save, X, Eye, EyeOff } from 'lucide-react';

const CATEGORIES = [
  { value: 'vetements', label: 'Vêtements' },
  { value: 'decorations', label: 'Décorations' },
  { value: 'cosmetiques', label: 'Cosmétiques' },
];

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [filterCat, setFilterCat] = useState('all');

  const fetchProducts = useCallback(async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem('admin-token');
    if (saved) {
      setToken(saved);
      fetchProducts();
    }
  }, [fetchProducts]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      const { token: t } = await res.json();
      setToken(t);
      sessionStorage.setItem('admin-token', t);
      fetchProducts();
    } else {
      setLoginError('Mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setToken('');
    sessionStorage.removeItem('admin-token');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    });
    fetchProducts();
  };

  const handleSave = async (product: Product) => {
    const method = isNew ? 'POST' : 'PUT';
    const res = await fetch('/api/products', {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(product),
    });
    if (res.ok) {
      setEditing(null);
      setIsNew(false);
      fetchProducts();
    } else {
      const err = await res.json();
      alert(err.error || 'Error saving product');
    }
  };

  const startNew = () => {
    setIsNew(true);
    setEditing({
      id: '',
      name: { en: '', fr: '' },
      description: { en: '', fr: '' },
      price: 0,
      images: [],
      category: 'vetements',
      sizes: [],
      colors: [],
      inStock: true,
      stockCount: 0,
      featured: false,
      bestSeller: false,
      tags: [],
    });
  };

  const filtered = filterCat === 'all' ? products : products.filter((p) => p.category === filterCat);

  // ── Login screen ──
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
            Euro<span className="text-[#E8B4B8]">shop</span>
          </h1>
          <p className="text-gray-500 text-center text-sm mb-6">Administration</p>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/50"
          />
          {loginError && <p className="text-red-500 text-sm mb-3">{loginError}</p>}
          <button className="w-full bg-[#2D2D3F] text-white py-3 rounded-lg font-medium hover:bg-[#3E3E55] transition-colors">
            Connexion
          </button>
        </form>
      </div>
    );
  }

  // ── Edit form ──
  if (editing) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <ProductForm
            product={editing}
            isNew={isNew}
            onSave={handleSave}
            onCancel={() => { setEditing(null); setIsNew(false); }}
          />
        </div>
      </div>
    );
  }

  // ── Product list ──
  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
              Euro<span className="text-[#E8B4B8]">shop</span> Admin
            </h1>
            <p className="text-gray-500 text-sm">{products.length} produits</p>
          </div>
          <div className="flex gap-2">
            <button onClick={startNew} className="flex items-center gap-1.5 bg-[#2D2D3F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3E3E55]">
              <Plus size={16} /> Ajouter
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-gray-500 px-3 py-2 rounded-lg text-sm hover:bg-gray-200">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilterCat('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${filterCat === 'all' ? 'bg-[#2D2D3F] text-white' : 'bg-white text-gray-600'}`}
          >
            Tout ({products.length})
          </button>
          {CATEGORIES.map((c) => {
            const count = products.filter((p) => p.category === c.value).length;
            return (
              <button
                key={c.value}
                onClick={() => setFilterCat(c.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${filterCat === c.value ? 'bg-[#2D2D3F] text-white' : 'bg-white text-gray-600'}`}
              >
                {c.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Produit</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Catégorie</th>
                <th className="text-left px-4 py-3">Prix</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Stock</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{p.name.fr}</p>
                    <p className="text-gray-400 text-xs">{p.id}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                      {CATEGORIES.find((c) => c.value === p.category)?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium">{formatPrice(p.price)}</span>
                    {p.originalPrice && (
                      <span className="text-gray-400 text-xs line-through ml-1">{formatPrice(p.originalPrice)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {p.inStock ? (
                      <span className="text-green-600 text-xs font-medium">{p.stockCount} en stock</span>
                    ) : (
                      <span className="text-red-500 text-xs font-medium">Rupture</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setEditing(p); setIsNew(false); }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Product Form Component ──
function ProductForm({
  product,
  isNew,
  onSave,
  onCancel,
}: {
  product: Product;
  isNew: boolean;
  onSave: (p: Product) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Product>({ ...product });
  const [sizesText, setSizesText] = useState(product.sizes.join(', '));
  const [tagsText, setTagsText] = useState(product.tags.join(', '));
  const [colorsText, setColorsText] = useState(
    product.colors.map((c) => `${c.name}:${c.hex}`).join(', ')
  );

  const update = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sizes = sizesText.split(',').map((s) => s.trim()).filter(Boolean);
    const tags = tagsText.split(',').map((s) => s.trim()).filter(Boolean);
    const colors = colorsText.split(',').map((s) => {
      const [name, hex] = s.trim().split(':');
      return { name: name?.trim() || '', hex: hex?.trim() || '#000000' };
    }).filter((c) => c.name);

    const id = isNew
      ? form.name.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : form.id;

    onSave({ ...form, id, sizes, tags, colors });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">{isNew ? 'Nouveau Produit' : 'Modifier Produit'}</h2>
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-5">
        {/* Names */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Nom (EN)</label>
            <input
              required
              value={form.name.en}
              onChange={(e) => update('name', { ...form.name, en: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Nom (FR)</label>
            <input
              required
              value={form.name.fr}
              onChange={(e) => update('name', { ...form.name, fr: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/50"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Description (EN)</label>
          <textarea
            required
            rows={2}
            value={form.description.en}
            onChange={(e) => update('description', { ...form.description, en: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/50 resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Description (FR)</label>
          <textarea
            required
            rows={2}
            value={form.description.fr}
            onChange={(e) => update('description', { ...form.description, fr: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/50 resize-none"
          />
        </div>

        {/* Category, Price, Original Price */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Catégorie</label>
            <select
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/50"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Prix (&euro;)</label>
            <input
              type="number"
              required
              min={0}
              step={0.01}
              value={form.price}
              onChange={(e) => update('price', parseFloat(e.target.value) || 0)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Ancien Prix (&euro;)</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={form.originalPrice || ''}
              onChange={(e) => update('originalPrice', parseFloat(e.target.value) || undefined)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/50"
              placeholder="Optionnel"
            />
          </div>
        </div>

        {/* Stock */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Quantité en stock</label>
            <input
              type="number"
              min={0}
              value={form.stockCount}
              onChange={(e) => {
                const count = parseInt(e.target.value) || 0;
                update('stockCount', count);
                update('inStock', count > 0);
              }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/50"
            />
          </div>
          <div className="flex items-end gap-4 pb-1">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update('featured', e.target.checked)}
                className="rounded"
              />
              En vedette
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.bestSeller}
                onChange={(e) => update('bestSeller', e.target.checked)}
                className="rounded"
              />
              Best Seller
            </label>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tailles (séparées par des virgules)</label>
          <input
            value={sizesText}
            onChange={(e) => setSizesText(e.target.value)}
            placeholder="S, M, L, XL ou 30ml, 50ml ou One Size"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/50"
          />
        </div>

        {/* Colors */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Couleurs (Nom:#hex, séparées par des virgules)</label>
          <input
            value={colorsText}
            onChange={(e) => setColorsText(e.target.value)}
            placeholder="Black:#000000, Rose:#FFB6C1"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/50"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tags (séparés par des virgules)</label>
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="robe, soie, élégant"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/50"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-1.5 bg-[#2D2D3F] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#3E3E55]"
          >
            <Save size={16} /> {isNew ? 'Créer le Produit' : 'Enregistrer'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100"
          >
            Annuler
          </button>
        </div>
      </div>
    </form>
  );
}
