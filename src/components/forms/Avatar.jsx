import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient.js';
import { FaUser, FaCamera } from 'react-icons/fa';

export default function Avatar({ url, onUpload, size = 150 }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  const downloadImage = async (path) => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.error('Error downloading image: ', error.message);
    }
  };

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

      if (uploadError) throw uploadError;

      onUpload(filePath);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative" style={{ height: size, width: size }}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="rounded-full object-cover"
          style={{ height: size, width: size }}
        />
      ) : (
        <div className="bg-gray-800 rounded-full flex items-center justify-center" style={{ height: size, width: size }}>
            <FaUser className="text-gray-500" style={{ fontSize: size / 2}} />
        </div>
      )}
      <div className="absolute bottom-0 right-0">
        <label htmlFor="avatar-upload" className="cursor-pointer bg-blue-600 p-3 rounded-full border-2 border-gray-900 hover:bg-blue-700">
            <FaCamera className="text-white"/>
        </label>
        <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
            className="hidden"
        />
      </div>
    </div>
  );
} 