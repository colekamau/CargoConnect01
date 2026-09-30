import { getFirestore, collection, addDoc, Timestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth } from '../config/firebaseConfig'; // Firebase config

const db = getFirestore();

// Function to send a message to Firestore
export const sendMessage = async (text) => {
  try {
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, 'messages'), {
        text,
        createdAt: Timestamp.fromDate(new Date()),
        senderId: user.uid,
        senderName: user.displayName || 'Anonymous', // Handle display name if available
      });
    }
  } catch (error) {
    console.error("Error sending message: ", error);
  }
};

// Function to listen for new messages in real-time
export const listenForMessages = (setMessages) => {
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));

  onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMessages(messages); // Update the state with new messages
  });
};
