import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase.config';

// Upload image to Firebase Storage
export const uploadImage = async (uri, path) => {
  try {
    // Convert URI to blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create a reference to the file location
    const storageRef = ref(storage, path);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, blob);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return { success: true, url: downloadURL };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: error.message };
  }
};

// Generate a unique filename for profile images
export const generateProfileImagePath = (userId, userType = 'teacher') => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  return `profile-images/${userType}/${userId}/${timestamp}_${randomId}.jpg`;
};