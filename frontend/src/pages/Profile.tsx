import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phone: string;
  organization: string;
  position: string;
  country: string;
  city: string;
  currentLevel: string;
  joinedDate: string;
}

/**
 * Profile page component
 * User profile management and settings
 */
const Profile: React.FC = () => {
  const navigate = useNavigate();

  // Mock user data - in real app, this would come from Redux store/API
  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    dateOfBirth: '1990-05-15',
    phone: '+1234567890',
    organization: 'Tech Company Ltd',
    position: 'Software Developer',
    country: 'United States',
    city: 'New York',
    currentLevel: 'A2',
    joinedDate: '2025-01-01'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    
    try {
      // In real app, call API to update profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setIsEditing(false);
      console.log('Profile updated:', profile);
      
      // Show success message (in real app, use toast notification)
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    setIsLoading(true);
    
    try {
      // In real app, call API to change password
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setShowChangePassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      console.log('Password changed successfully');
      
      // Show success message
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-body text-center">
              <div className="mb-4">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary-600">
                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-gray-600 mb-4">{profile.email}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <span className={`level-${profile.currentLevel} mr-2`}>
                    {profile.currentLevel}
                  </span>
                  <span className="text-sm text-gray-600">Current Level</span>
                </div>
                <p className="text-sm text-gray-600">
                  Member since {formatDate(profile.joinedDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card mt-6">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </div>
            <div className="card-body space-y-3">
              <button
                onClick={() => setShowChangePassword(true)}
                className="w-full btn-outline-primary text-left"
              >
                Change Password
              </button>
              <button
                onClick={() => navigate('/test/history')}
                className="w-full btn-outline-primary text-left"
              >
                View Test History
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full btn-outline-primary text-left"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-outline-primary"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn-outline-secondary"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    className="input-field"
                    placeholder="Enter your first name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    className="input-field"
                    placeholder="Enter your last name"
                  />
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="input-field"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                    className="input-field"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Organization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={profile.organization}
                    onChange={(e) => handleInputChange('organization', e.target.value)}
                    disabled={!isEditing}
                    className="input-field"
                    placeholder="Enter your organization"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={profile.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    disabled={!isEditing}
                    className="input-field"
                    placeholder="Enter your position"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={profile.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    disabled={!isEditing}
                    className="input-field"
                    placeholder="Enter your country"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    disabled={!isEditing}
                    className="input-field"
                    placeholder="Enter your city"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Change Password
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="input-field"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="input-field"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className="input-field"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowChangePassword(false)}
                className="btn-outline-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
