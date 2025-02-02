 
// Match.js
"use client"
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'; 
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth'; 
 import { firebaseApp} from "../../lib/firebaseConfig";

import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';
const Match = () => {
 
const [matchedUsers, setMatchedUsers] = useState<string[]>([]);
  const [currentUserGender, setCurrentUserGender] = useState(null); 

  const [user, setUser] = useState<User | null>(null);
  
  const router = useRouter();

   
  
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/'); 
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

 
  useEffect(() => {
    const fetchUserGender = async () => {
      if (user) {
        const db = getFirestore(firebaseApp);
        const usersCollection = collection(db, 'users');
        const userDoc = doc(usersCollection, user.uid);
        
        try {
          const userDocSnapshot = await getDoc(userDoc);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setCurrentUserGender(userData.gender);
            console.log("gender" +userData.gender);
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
 
  useEffect(() => {
    const fetchMatchedUsers = async () => {
      if (currentUserGender) {
        const db = getFirestore(firebaseApp);
        const usersCollectionRef = collection(db, 'users');
        let usersQuery;
        
        // Fetch users based on the current user's gender
        if (currentUserGender === 'male') {
          usersQuery = await getDocs(query(usersCollectionRef, where('gender', '==', 'female')));
        } else if (currentUserGender === 'female') {
          usersQuery = await getDocs(query(usersCollectionRef, where('gender', '==', 'male')));
        } else {
          // Handle case where gender is not determined
          return;
        }

        const matchedUsers: any[] | ((prevState:string[]) => string[]) = [];
        usersQuery.forEach(doc => {
          const userData = doc.data();
          matchedUsers.push(userData.name);
        });
        setMatchedUsers(matchedUsers);
        console.log("test match"+setMatchedUsers(matchedUsers));
      }
    };

    fetchMatchedUsers();

  }, [currentUserGender]);
 
  return (
   
    <section className="  h-screen relative">
 
     
<form className="fixed h-[calc(100vh-6rem)] w-[90vw] md:w-[28vw]  overflow-auto top-24 right-[calc(50%-45vw)] z-10 bg-white p-8 rounded-lg shadow-lg ">
   <div>
     {/* <h1>Profile Page</h1> */}
       {user && (
         <div>
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2"> Welcome,{user.displayName}</label>
            <label htmlFor="name" className="block text-gray-700  font-w400 mb-2">Profiles Thatll Make Your Heart Skip Beat</label>
           {/* <p>{user.displayName}</p> */}
           {/* {user.photoURL && <img src={user.photoURL} alt="Profile" style={{ width: '100px', borderRadius: '50%' }} />} */}
           {/* <button onClick={handleSignOut}>Sign out</button> */}
         </div>
       )}

      <h1 style={{ fontFamily: 'Arial', color: '#333' }}>Meet Your Potential Matches!</h1>
{matchedUsers.length > 0 ? (
  <ul style={{ fontFamily: 'Arial', fontSize: '16px', color: '#666' }}>
    {matchedUsers.map((userName, index) => (
      <li key={index}>{userName}</li>
    ))}
  </ul>
) : (
  <p style={{ fontFamily: 'Arial', fontSize: '16px', color: '#666' }}>Oops, looks like your search history is as empty as your love life! But hey, at least youre consistent in not finding any matches, whether its on the internet or in your dating endeavors. Maybe you should start swiping right on memes instead, they seem to be the only thing consistently making you laugh these days!</p>
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
{/* <div>
     <h1>Profile Page</h1>
       {user && (
         <div>
           <p>Welcome, {user.displayName}</p>
           {user.photoURL && <img src={user.photoURL} alt="Profile" style={{ width: '100px', borderRadius: '50%' }} />}
           <button onClick={handleSignOut}>Sign out</button>
         </div>
       )}
     </div> */}
      {/* CSS */}
      <style jsx>
        {`
    
       @media (max-width: 768px) {
       iframe {
    display: block;  
 
  }
    } 
 .logo {
          display: block;
        }
      `}
      </style>
    </section>
  );
};

export default Match;
