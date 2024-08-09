// components/Profile.js
'use client'
import { useState } from 'react';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaPhone, FaTransgender, FaImage } from 'react-icons/fa';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    nickname: '',
    email: '',
    address: '',
    phone: '',
    gender: '',
    picture: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePictureChange = (e) => {
    setProfile({ ...profile, picture: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(profile);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start p-4 lg:p-8 bg-gray-100 max-h-screen">
      <div className="flex flex-col items-center lg:w-1/3 mb-6 lg:mb-0 lg:mr-8">
        <div className="bg-white p-4 rounded-lg shadow-lg w-full">
          <div className="flex flex-col items-center">
            {profile.picture ? (
              <img
                src={URL.createObjectURL(profile.picture)}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover mb-4"
              />
            ) : (
              <FaImage className="w-40 h-40 text-gray-300 mb-4" />
            )}
            <label className="w-full">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePictureChange}
              />
              <div className="text-center cursor-pointer text-blue-500 hover:text-blue-600">
                Upload Picture
              </div>
            </label>
          </div>
        </div>
      </div>
      <div className="lg:w-2/3 w-full">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <div className="flex items-center">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-center">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="text"
              name="nickname"
              value={profile.nickname}
              onChange={handleChange}
              placeholder="Nickname"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-center">
            <FaEnvelope className="text-gray-500 mr-2" />
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-gray-500 mr-2" />
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-center">
            <FaPhone className="text-gray-500 mr-2" />
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-center">
            <FaTransgender className="text-gray-500 mr-2" />
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
