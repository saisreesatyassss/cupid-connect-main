 
// // Match.js
"use client"
// import { useRouter } from 'next/navigation'
// import React, { useState, useEffect } from 'react'; 
// import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth'; 
//  import { firebaseApp} from "../../lib/firebaseConfig";

// import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';
// const Match = () => {
 
// const [matchedUsers, setMatchedUsers] = useState<string[]>([]);
//   const [currentUserGender, setCurrentUserGender] = useState(null); 

//   const [user, setUser] = useState<User | null>(null);
  
//   const router = useRouter();

   
  
// const auth = getAuth(firebaseApp);
// const db = getFirestore(firebaseApp);

//   useEffect(() => {
   
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUser(user);
//       } else {
     
//                 setUser(null);

//         router.push('/');
//       }
//     });

//     return () => unsubscribe();
//   }, []);

 
 
//   useEffect(() => {
//     const fetchUserGender = async () => {
//       if (user) {
//         const db = getFirestore(firebaseApp);
//         const usersCollection = collection(db, 'users');
//         const userDoc = doc(usersCollection, user.uid);
        
//         try {
//           const userDocSnapshot = await getDoc(userDoc);
//           if (userDocSnapshot.exists()) {
//             const userData = userDocSnapshot.data();
//             setCurrentUserGender(userData.gender);
//             console.log("gender" +userData.gender);
//           } else {
//             setCurrentUserGender(null); 
//           }
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         }
//       }
//     };

//     fetchUserGender();

//   }, [user]); 
 
//   useEffect(() => {
//     const fetchMatchedUsers = async () => {
//       if (currentUserGender) {
//         const db = getFirestore(firebaseApp);
//         const usersCollectionRef = collection(db, 'users');
//         let usersQuery;
        
 
//         if (currentUserGender === 'male') {
//           usersQuery = await getDocs(query(usersCollectionRef, where('gender', '==', 'female')));
//         } else if (currentUserGender === 'female') {
//           usersQuery = await getDocs(query(usersCollectionRef, where('gender', '==', 'male')));
//         } else {
 
//           return;
//         }

//         const matchedUsers: any[] | ((prevState:string[]) => string[]) = [];
//         usersQuery.forEach(doc => {
//           const userData = doc.data();
//           matchedUsers.push(userData.name);
//         });
//         setMatchedUsers(matchedUsers);
//         console.log("test match"+setMatchedUsers(matchedUsers));
//       }
//     };

//     fetchMatchedUsers();

//   }, [currentUserGender]);
 

//    const handleMessageClick = (receiverId: string, receiverName: string) => {
//     router.push(`/messages?receiverId=${receiverId}&receiverName=${receiverName}`);
//   };

//   return (
   
//     <section className="  h-screen relative">
 
     
// <form className="fixed h-[calc(100vh-6rem)] w-[90vw] md:w-[28vw]  overflow-auto top-24 right-[calc(50%-45vw)] z-10 bg-white p-8 rounded-lg shadow-lg ">
//    <div>
//      {/* <h1>Profile Page</h1> */}
//        {user && (
//          <div>
//             <label htmlFor="name" className="block text-gray-700 font-bold mb-2"> Welcome,{user.displayName}</label>
//             <label htmlFor="name" className="block text-gray-700  font-w400 mb-2">Profiles Thatll Make Your Heart Skip Beat</label>
//          </div>
//        )}

//       <h1 style={{ fontFamily: 'Arial', color: '#333' }}>Meet Your Potential Matches!</h1>
// {matchedUsers.length > 0 ? (
//   <ul style={{ fontFamily: 'Arial', fontSize: '16px', color: '#666' }}>
//     {matchedUsers.map((userName, index) => (
//                 <li key={index} className="flex justify-between items-center mb-4 p-2 border rounded">
//                   <span>{userName}</span>
//                   <button
//                     onClick={() => handleMessageClick(matchedUsers[index].id, userName)}
//                     className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                   >
//                     Message
//                   </button>
//                 </li>
      
//     ))}
//   </ul>
// ) : (
//   <p style={{ fontFamily: 'Arial', fontSize: '16px', color: '#666' }}>Oops, looks like your search history is as empty as your love life! But hey, at least youre consistent in not finding any matches, whether its on the internet or in your dating endeavors. Maybe you should start swiping right on memes instead, they seem to be the only thing consistently making you laugh these days!</p>
// )}

// </div> 
// </form>
 
//       <iframe
//         src="https://saisreesatyassss.github.io/loveBalloon/"
//         width="100%"
//         height="100%"
//         frameBorder="0"
//         allowFullScreen
//         className="z-0"
//       />

//       <style jsx>
//         {`
    
//        @media (max-width: 768px) {
//        iframe {
//     display: block;  
 
//   }
//     } 
//  .logo {
//           display: block;
//         }
//       `}
//       </style>
//     </section>
//   );
// };

// export default Match;
// Match.js


// "use client"
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'; 
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'; 
import { firebaseApp } from "../../lib/firebaseConfig";
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';

interface MatchedUser {
  id: string;
  name: string;
  gender: string;
}

const Match = () => {
  const [matchedUsers, setMatchedUsers] = useState<MatchedUser[]>([]);
  const [currentUserGender, setCurrentUserGender] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch current user's gender
  useEffect(() => {
    const fetchUserGender = async () => {
      if (user) {
        const userDoc = doc(collection(db, 'users'), user.uid);
        
        try {
          const userDocSnapshot = await getDoc(userDoc);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setCurrentUserGender(userData.gender);
          } else {
            setCurrentUserGender(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserGender();
  }, [user]);

  // Fetch matched users with their IDs
  useEffect(() => {
    const fetchMatchedUsers = async () => {
      if (currentUserGender) {
        const usersCollectionRef = collection(db, 'users');
        let usersQuery;

        // Query users of opposite gender
        if (currentUserGender === 'male') {
          usersQuery = query(usersCollectionRef, where('gender', '==', 'female'));
        } else if (currentUserGender === 'female') {
          usersQuery = query(usersCollectionRef, where('gender', '==', 'male'));
        } else {
          return;
        }

        try {
          const querySnapshot = await getDocs(usersQuery);
          const matches: MatchedUser[] = [];
          
          querySnapshot.forEach(doc => {
            const userData = doc.data();
            // Only add users who have a name
            if (userData.name) {
              matches.push({
                id: doc.id,
                name: userData.name,
                gender: userData.gender
              });
            }
          });
          
          setMatchedUsers(matches);
        } catch (error) {
          console.error('Error fetching matches:', error);
        }
      }
    };

    fetchMatchedUsers();
  }, [currentUserGender]);

  // Handle clicking the message button
  const handleMessageClick = (receiverId: string, receiverName: string) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }
    
    // Encode the receiver name to handle special characters in URLs
    const encodedReceiverName = encodeURIComponent(receiverName);
    router.push(`/messages?receiverId=${receiverId}&receiverName=${encodedReceiverName}`);
  };

  return (
    <section className="h-screen relative">
      <form className="fixed h-[calc(100vh-6rem)] w-[90vw] md:w-[28vw] overflow-auto top-24 right-[calc(50%-45vw)] z-10 bg-white p-8 rounded-lg shadow-lg">
        <div>
          {user && (
            <div>
              <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                Welcome, {user.displayName}
              </label>
              <label htmlFor="name" className="block text-gray-700 font-w400 mb-2">
                Profiles That'll Make Your Heart Skip Beat
              </label>
            </div>
          )}

          <h1 style={{ fontFamily: 'Arial', color: '#333' }}>
            Meet Your Potential Matches!
          </h1>
          
          {matchedUsers.length > 0 ? (
            <ul className="space-y-4">
              {matchedUsers.map((matchedUser) => (
                <li 
                  key={matchedUser.id} 
                  className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
                >
                  <span className="text-gray-700">{matchedUser.name}</span>
                  <button  type="button"  // Prevents accidental form submission

                    onClick={() => handleMessageClick(matchedUser.id, matchedUser.name)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Message
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontFamily: 'Arial', fontSize: '16px', color: '#666' }}>
              Oops, looks like your search history is as empty as your love life! But hey, at least you're consistent in not finding any matches, whether it's on the internet or in your dating endeavors. Maybe you should start swiping right on memes instead, they seem to be the only thing consistently making you laugh these days!
            </p>
          )}
        </div>
      </form>

      <iframe
        src="https://saisreesatyassss.github.io/loveBalloon/"
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        className="z-0"
      />

      <style jsx>{`
        @media (max-width: 768px) {
          iframe {
            display: block;
          }
        }
        .logo {
          display: block;
        }
      `}</style>
    </section>
  );
};

export default Match;