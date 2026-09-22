import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiMapPin, FiPackage, FiHeart, FiLock, FiLogOut, FiEdit2, FiSave } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('personal');
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    postalCode: user?.addresses?.[0]?.postalCode || '',
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const addresses = [
        {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: 'India',
        },
      ];

      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        avatar: formData.avatar,
        addresses,
      });

      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Nav */}
          <div className="rounded-3xl bg-white p-6 shadow-card border border-caramel/15 space-y-6 h-fit">
            <div className="text-center pb-4 border-b border-cream">
              <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-caramel shadow-sm mb-3">
                <img src={user.avatar} alt="" className="h-full w-full object-cover" />
              </div>
              <h3 className="heading-serif text-lg font-bold text-dark-espresso">{user.name}</h3>
              <p className="text-xs text-coffee-brown/70">{user.email}</p>
            </div>

            <nav className="space-y-1">
              {[
                { id: 'personal', name: 'Personal Information', icon: FiUser },
                { id: 'address', name: 'Saved Addresses', icon: FiMapPin },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? 'bg-caramel text-cream'
                      : 'text-dark-espresso hover:bg-cream'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </button>
              ))}

              <Link
                to="/orders"
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-dark-espresso hover:bg-cream rounded-xl transition-colors"
              >
                <FiPackage className="h-4 w-4 text-caramel" />
                My Orders
              </Link>

              <Link
                to="/favorites"
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-dark-espresso hover:bg-cream rounded-xl transition-colors"
              >
                <FiHeart className="h-4 w-4 text-caramel" />
                Favorites
              </Link>

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-4 border-t border-cream"
              >
                <FiLogOut className="h-4 w-4" />
                Logout
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 rounded-3xl bg-white p-8 shadow-card border border-caramel/15">
            <div className="flex items-center justify-between border-b border-cream pb-4 mb-6">
              <h2 className="heading-serif text-2xl font-bold text-dark-espresso">
                {activeTab === 'personal' ? 'Personal Information' : 'Saved Addresses'}
              </h2>

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-caramel hover:text-coffee-brown"
                >
                  <FiEdit2 className="h-4 w-4" /> Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setEditing(false)}
                  className="text-xs font-bold text-gray-500 hover:underline"
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {activeTab === 'personal' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-dark-espresso mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!editing}
                        className="w-full rounded-xl border border-caramel/30 bg-cream/50 px-4 py-2.5 text-xs text-dark-espresso disabled:opacity-70"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-dark-espresso mb-1">Email Address</label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full rounded-xl border border-caramel/20 bg-gray-100 px-4 py-2.5 text-xs text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-dark-espresso mb-1">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder="+91 9876543210"
                        className="w-full rounded-xl border border-caramel/30 bg-cream/50 px-4 py-2.5 text-xs text-dark-espresso disabled:opacity-70"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-dark-espresso mb-1">Avatar Image URL</label>
                      <input
                        type="text"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleChange}
                        disabled={!editing}
                        className="w-full rounded-xl border border-caramel/30 bg-cream/50 px-4 py-2.5 text-xs text-dark-espresso disabled:opacity-70"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'address' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-dark-espresso mb-1">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="123 Coffee Lane"
                      className="w-full rounded-xl border border-caramel/30 bg-cream/50 px-4 py-2.5 text-xs text-dark-espresso disabled:opacity-70"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-dark-espresso mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder="New Delhi"
                        className="w-full rounded-xl border border-caramel/30 bg-cream/50 px-3 py-2.5 text-xs text-dark-espresso disabled:opacity-70"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-dark-espresso mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder="Delhi"
                        className="w-full rounded-xl border border-caramel/30 bg-cream/50 px-3 py-2.5 text-xs text-dark-espresso disabled:opacity-70"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-dark-espresso mb-1">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder="110001"
                        className="w-full rounded-xl border border-caramel/30 bg-cream/50 px-3 py-2.5 text-xs text-dark-espresso disabled:opacity-70"
                      />
                    </div>
                  </div>
                </div>
              )}

              {editing && (
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-caramel px-8 py-3 text-xs font-bold text-cream shadow-md hover:bg-coffee-brown transition-colors disabled:opacity-50"
                >
                  <FiSave className="h-4 w-4" />
                  {saving ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
