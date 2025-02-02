// // Messages.tsx
// "use client"
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { 
//   getFirestore, 
//   collection, 
//   addDoc, 
//   query, 
//   where, 
//   orderBy,
//   onSnapshot,
//   serverTimestamp,
// } from 'firebase/firestore';
// import { firebaseApp } from "../../lib/firebaseConfig";

// interface Message {
//   id: string;
//   text: string;
//   senderId: string;
//   receiverId: string;
//   senderName: string;
//   timestamp: any;
// }

// const Messages = () => {
//   const router = useRouter();
//   const [user, setUser] = useState<any>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [receiverId, setReceiverId] = useState('');
//   const [receiverName, setReceiverName] = useState('');

//   const auth = getAuth(firebaseApp);
//   const db = getFirestore(firebaseApp);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);
//       } else {
//         router.push('/');
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (!user) return;

//     // Get receiverId and receiverName from URL params
//     const params = new URLSearchParams(window.location.search);
//     const rid = params.get('receiverId');
//     const rname = params.get('receiverName');
//     if (rid && rname) {
//       setReceiverId(rid);
//       setReceiverName(rname);
//     }

//     // Set up messages listener
//     const messagesRef = collection(db, 'messages');
//     const q = query(
//       messagesRef,
//       where('participants', 'array-contains', user.uid),
//       orderBy('timestamp', 'asc')
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const messageList: Message[] = [];
//       snapshot.forEach((doc) => {
//         const data = doc.data();
//         if ((data.senderId === user.uid && data.receiverId === rid) ||
//             (data.senderId === rid && data.receiverId === user.uid)) {
//           messageList.push({
//             id: doc.id,
//             text: data.text,
//             senderId: data.senderId,
//             receiverId: data.receiverId,
//             senderName: data.senderName,
//             timestamp: data.timestamp
//           });
//         }
//       });
//       setMessages(messageList);
//     });

//     return () => unsubscribe();
//   }, [user, receiverId]);

//   const sendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !receiverId) return;

//     try {
//       await addDoc(collection(db, 'messages'), {
//         text: newMessage,
//         senderId: user.uid,
//         senderName: user.displayName,
//         receiverId: receiverId,
//         participants: [user.uid, receiverId],
//         timestamp: serverTimestamp(),
//       });
//       setNewMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   return (

//     <div className="mt-50 h-screen flex flex-col bg-gray-100 p-4">
//       <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
//         <h2 className="text-xl font-bold">Chat with {receiverName}</h2>
//       </div>
      
//       <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-lg p-4 mb-4">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`mb-4 ${
//               message.senderId === user?.uid
//                 ? 'text-right'
//                 : 'text-left'
//             }`}
//           >
//             <div
//               className={`inline-block p-2 rounded-lg ${
//                 message.senderId === user?.uid
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-gray-200 text-gray-700'
//               }`}
//             >
//               <p className="text-sm font-semibold">{message.senderName}</p>
//               <p>{message.text}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <form onSubmit={sendMessage} className="bg-white rounded-lg shadow-lg p-4">
//         <div className="flex gap-2">
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type your message..."
//             className="flex-1 p-2 border rounded-lg"
//           />
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//           >
//             Send
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Messages;

"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  serverTimestamp,
  limit,
} from 'firebase/firestore';
import { firebaseApp } from "../../lib/firebaseConfig";

interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  timestamp: any;
}

const Messages = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    try {
      // Get receiverId and receiverName from URL params
      const params = new URLSearchParams(window.location.search);
      const rid = params.get('receiverId');
      const rname = params.get('receiverName');
      
      if (!rid || !rname) {
        console.error('Missing receiver information');
        router.push('/contacts'); // Redirect to contacts page if no receiver info
        return;
      }

      setReceiverId(rid);
      setReceiverName(rname);

      // Set up messages listener
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef,
        where('participants', 'array-contains', user.uid),
        orderBy('timestamp', 'asc'),
        limit(100) // Limit to last 100 messages for performance
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const messageList: Message[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            if ((data.senderId === user.uid && data.receiverId === rid) ||
                (data.senderId === rid && data.receiverId === user.uid)) {
              messageList.push({
                id: doc.id,
                text: data.text,
                senderId: data.senderId,
                receiverId: data.receiverId,
                senderName: data.senderName,
                timestamp: data.timestamp
              });
            }
          });
          setMessages(messageList);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error fetching messages:", error);
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Error in messages setup:", error);
      setIsLoading(false);
    }
  }, [user, receiverId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !receiverId || !user) return;

    try {
      const messageData = {
        text: newMessage.trim(),
        senderId: user.uid,
        senderName: user.displayName || 'Anonymous',
        receiverId: receiverId,
        participants: [user.uid, receiverId],
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, 'messages'), messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <h2 className="text-xl font-bold">Chat with {receiverName}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-lg p-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.senderId === user?.uid
                ? 'text-right'
                : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg max-w-[70%] break-words ${
                message.senderId === user?.uid
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <p className="text-sm font-semibold">{message.senderName}</p>
              <p>{message.text}</p>
              {message.timestamp && (
                <p className="text-xs opacity-75 mt-1">
                  {message.timestamp.toDate().toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg"
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Messages;