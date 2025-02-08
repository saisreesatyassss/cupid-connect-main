  
  "use client"
  import React, { useState, useEffect, useRef ,Suspense } from 'react';
  import { useRouter, useSearchParams } from 'next/navigation'; 
  import { Menu, ArrowLeft, X } from 'lucide-react';
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
    doc,
    getDoc,
    getDocs,
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
type ProfileRelationship = 'you_unlocked' | 'they_unlocked';

// Update the interface
interface UnlockedProfile {
  id: string;
  name: string;
  relationship: ProfileRelationship;
}

  const MessagesContent  = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [receiverId, setReceiverId] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [unlockedProfiles, setUnlockedProfiles] = useState<UnlockedProfile[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);
 // Extract receiverId and receiverName from the URL when component mounts or URL changes
   const searchParams = useSearchParams(); // <-- New way to access query params in Next.js 13+

  useEffect(() => {
    // const params = new URLSearchParams(window.location.search);
    // const rid = params.get("receiverId");
    // const rname = params.get("receiverName");

    const rid = searchParams.get("receiverId");
    const rname = searchParams.get("receiverName");

    if (!rid || !rname) {
      console.error("Missing receiver information");
      router.push("/match");
      return;
    }

    setReceiverId(rid);
    setReceiverName(rname);
  }, [searchParams, router]);

    // Scroll to bottom of messages
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

//  useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);
//         // Fetch unlocked profiles when user is set
//         const fetchUnlockedProfiles = async () => {
//           const userDocRef = doc(db, 'users', currentUser.uid);
//           const userDocSnap = await getDoc(userDocRef);
//           if (userDocSnap.exists()) {
//             const unlockedIds = userDocSnap.data().unlockedProfiles || [];
//             console.log(unlockedIds)
//             const profiles = await Promise.all(
//               unlockedIds.map(async (id: string) => {
//                 const profileDocRef = doc(db, 'users', id);
//                 const profileSnap = await getDoc(profileDocRef);
//                         console.log(profileSnap.data())
    
//                 return {
//                   id,
//                   name: profileSnap.exists() ? profileSnap.data().name || 'Unknown' : 'Unknown'
//                 };
//               })
//             );
//             setUnlockedProfiles(profiles);
//           }
//         };
//         fetchUnlockedProfiles();
//       } else {
//         router.push('/');
//       }
//     });

//     return () => unsubscribe();
//   }, []);
  
// The rest of your component code remains the same, but now TypeScript will recognize the relationship property
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
      
      const fetchAllProfiles = async () => {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        // Get profiles that the current user has unlocked
        const unlockedIds = userDocSnap.exists() ? userDocSnap.data().unlockedProfiles || [] : [];
        
        // Query all users who have unlocked the current user
        const usersRef = collection(db, 'users');
        const usersSnap = await getDocs(usersRef);
        const usersWhoUnlockedMe = usersSnap.docs
          .filter(doc => {
            const unlockedProfiles = doc.data().unlockedProfiles || [];
            return unlockedProfiles.includes(currentUser.uid);
          })
          .map(doc => doc.id);
        
        // Combine both sets of IDs and remove duplicates
        const allRelevantIds = [...new Set([...unlockedIds, ...usersWhoUnlockedMe])];
        
        // Fetch profile details for all relevant IDs
        const profiles: UnlockedProfile[] = await Promise.all(
          allRelevantIds.map(async (id: string) => {
            const profileDocRef = doc(db, 'users', id);
            const profileSnap = await getDoc(profileDocRef);
            const profileData = profileSnap.data();
            
            return {
              id,
              name: profileSnap.exists() ? profileData?.name || 'Unknown' : 'Unknown',
              relationship: unlockedIds.includes(id) ? 'you_unlocked' : 'they_unlocked'
            };
          })
        );
        
        setUnlockedProfiles(profiles);
      };
      
      fetchAllProfiles();
    } else {
      router.push('/');
    }
  });

  return () => unsubscribe();
}, []);








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
 


  // Fetch messages when receiverId changes
  useEffect(() => {
    if (!user || !receiverId) return;

    try {
      const messagesRef = collection(db, "messages");
      const q = query(
        messagesRef,
        where("participants", "array-contains", user.uid),
        orderBy("timestamp", "asc"),
        limit(100)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const messageList: Message[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            if (
              (data.senderId === user.uid && data.receiverId === receiverId) ||
              (data.senderId === receiverId && data.receiverId === user.uid)
            ) {
              messageList.push({
                id: doc.id,
                text: data.text,
                senderId: data.senderId,
                receiverId: data.receiverId,
                senderName: data.senderName,
                timestamp: data.timestamp,
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
  }, [user, receiverId]); // Fetch messages when `receiverId` changes

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




  const handleSelectChat = (profile: { id: React.SetStateAction<string>; name: React.SetStateAction<string>; }) => {
    if (receiverId !== profile.id) {
      setReceiverId(profile.id);
      setReceiverName(profile.name);
      setIsSidebarOpen(false);
    }
  };



const getFirstName = (name: string | undefined) => {
  if (!name) return 'Chat';
  return name.split(' ')[0]; // Get the first word as the first name
};

   return (
  <div className="h-screen flex flex-col md:flex-row bg-white">
    {/* Mobile Header */}
<div className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-30">
  {receiverId && (
    <button 
      onClick={() => router.back()}
      className="p-2 hover:bg-gray-100 rounded-lg touch-manipulation"
      aria-label="Go back"
    >
      <ArrowLeft className="h-6 w-6 text-gray-700" />
    </button>
  )}
  <h1 className="font-semibold text-lg truncate flex-1 text-center text-gray-900">
    {receiverId ? getFirstName(receiverName) : 'Messages'}
  </h1>
  <button 
    onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
    className="p-2 hover:bg-gray-100 rounded-lg touch-manipulation" 
    aria-label="Toggle menu" 
  >
    <Menu className="h-6 w-6 text-gray-700" />
  </button>
</div>

    {/* Sidebar */}
    <div className={`
      fixed md:static inset-0 z-20 bg-white transform transition-transform duration-200 ease-in-out
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0 md:w-80 md:flex-shrink-0 border-r border-gray-200
      flex flex-col h-full
    `}
      aria-hidden={!isSidebarOpen && window.innerWidth < 768}
    >
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg touch-manipulation"
          aria-label="Close menu"
        >
          <X className="h-5 w-5 text-gray-700" />
        </button>
      </div>
      
      <div className="overflow-y-auto flex-1 overscroll-contain">
        {unlockedProfiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => {
              router.push(
                `/messages?receiverId=${profile.id}&receiverName=${encodeURIComponent(profile.name)}`
              );
              setReceiverId(profile.id);
              setReceiverName(profile.name);
              setIsSidebarOpen(false);
            }}
            className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors
              flex items-center gap-3 text-left
              ${receiverId === profile.id ? 'bg-blue-50 hover:bg-blue-50' : ''}
            `}
          >
            <div className="flex flex-col flex-1">
              <p className="font-medium truncate text-gray-900">
                {getFirstName(profile.name)}
              </p>
              <span className="text-sm text-gray-600">
                {profile.relationship === 'you_unlocked' ? 'You unlocked' : 'Unlocked you'}
              </span>
            </div>
          </button>
        ))}
        {unlockedProfiles.length === 0 && (
          <div className="p-4 text-gray-600 text-center">No unlocked profiles</div>
        )}
      </div>
    </div>

    {/* Overlay */}
    {isSidebarOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
        onClick={() => setIsSidebarOpen(false)}
        aria-label="Close menu overlay"
        role="button"
        tabIndex={0}
      />
    )}

    {/* Main Chat Area */}
    <div className="flex-1 flex flex-col min-w-0 h-full">
      {receiverId ? (
        <>
          <div className="hidden md:block bg-white border-b border-gray-200 p-4">
            <h2 className="text-xl font-semibold truncate text-gray-900">{receiverName}</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === user?.uid ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] md:max-w-[60%] rounded-lg px-4 py-2 break-words
                    ${message.senderId === user?.uid
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                    }
                  `}
                >
                  <p className="text-sm font-semibold mb-1">
                    {getFirstName(message.senderName)}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  {message.timestamp && (
                    <p className={`text-xs mt-1 ${
                      message.senderId === user?.uid ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toDate().toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 bg-white p-4 safe-bottom">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                  focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500
                  disabled:opacity-50"
                maxLength={1000}
                disabled={!receiverId}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || !receiverId}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                  disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                  active:bg-blue-700 touch-manipulation focus:outline-none focus:ring-2 
                  focus:ring-blue-500 focus:ring-offset-2"
              >
                Send
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-600 text-lg p-4 text-center bg-gray-50">
          Select a chat to start messaging
        </div>
      )}
    </div>
  </div>
);


  };

 
const Messages = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MessagesContent />
    </Suspense>
  );
};

export default Messages;