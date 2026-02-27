import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDb } from "./firebase.config";

// Create a new document
/**
 * Create a new document in Firestore. If `docId` is provided (string), the document
 * will be created with that ID using `setDoc`. If `docId` is `null` or `undefined`,
 * a new document will be added with an auto-generated ID using `addDoc`.
 * @param {string} collectionName
 * @param {Object} data
 * @param {string|null|undefined} [docId]
 */
export const createDocument = async (collectionName, data, docId) => {
  const firestore = getDb();
  if (!firestore) {
    return {
      success: false,
      error: "Firestore not initialized. See console for details.",
    };
  }

  try {
    if (docId != null) {
      await setDoc(doc(firestore, collectionName, docId), data);
      return { success: true, id: docId };
    } else {
      const docRef = await addDoc(collection(firestore, collectionName), data);
      return { success: true, id: docRef.id };
    }
  } catch (error) {
    console.error("Firestore error:", error);
    return {
      success: false,
      error: error.message || "Unknown Firestore error",
    };
  }
};

// Get a single document
export const getDocument = async (collectionName, docId) => {
  const firestore = getDb();
  if (!firestore) {
    return {
      success: false,
      error: "Firestore not initialized. See console for details.",
    };
  }

  try {
    const docRef = doc(firestore, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: "Document not found" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all documents in a collection
export const getAllDocuments = async (collectionName) => {
  const firestore = getDb();
  if (!firestore) {
    return {
      success: false,
      error: "Firestore not initialized. See console for details.",
    };
  }

  try {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: documents };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update a document
export const updateDocument = async (collectionName, docId, data) => {
  const firestore = getDb();
  if (!firestore) {
    return {
      success: false,
      error: "Firestore not initialized. See console for details.",
    };
  }

  try {
    const docRef = doc(firestore, collectionName, docId);
    await updateDoc(docRef, data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete a document
export const deleteDocument = async (collectionName, docId) => {
  const firestore = getDb();
  if (!firestore) {
    return {
      success: false,
      error: "Firestore not initialized. See console for details.",
    };
  }

  try {
    await deleteDoc(doc(firestore, collectionName, docId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Query documents with a condition
export const queryDocuments = async (
  collectionName,
  field,
  operator,
  value,
) => {
  const firestore = getDb();
  if (!firestore) {
    return {
      success: false,
      error: "Firestore not initialized. See console for details.",
    };
  }

  try {
    const q = query(
      collection(firestore, collectionName),
      where(field, operator, value),
    );
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: documents };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update user profile photo
export const updateUserProfilePhoto = async (userId, photoURL) => {
  const firestore = getDb();
  if (!firestore) {
    return {
      success: false,
      error: "Firestore not initialized. See console for details.",
    };
  }

  try {
    await updateDoc(doc(firestore, "users", userId), {
      profilePhoto: photoURL,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating profile photo:", error);
    return { success: false, error: error.message };
  }
};
