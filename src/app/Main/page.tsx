// Import the necessary libraries
"use client";
import React, { useState } from 'react'; 
import Image from 'next/image'; 
import { useRouter } from 'next/navigation'; 
import { firebaseApp} from "../../lib/firebaseConfig";


import { GoogleAuthProvider, User, getAuth, signInWithPopup } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';

 
 
const auth = getAuth(firebaseApp);
 
function Main() {

const [user, setUser] = useState<User | null>(null);
const router = useRouter();

// const signIn = async () => {
//   try {
 
//     const currentUser = auth.currentUser;
//     if (currentUser) {
 
//       console.log("User is already signed in.");
//       router.push('/profile');
//       return;  
//     }

 
//     const provider = new GoogleAuthProvider();
//     const result = await signInWithPopup(auth, provider);
//     setUser(result.user);
//     if (typeof window !== 'undefined') {
//       console.log("Redirecting to /profile");
//       router.push('/profile');
//     }
//   } catch (error) {
//     console.error("Error signing in:", error);
//   }
// };

const signIn = async () => {
  try {
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      console.log("User is already signed in.");
      await checkUserProfile(currentUser.uid);
      return;
    }

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);

    if (typeof window !== 'undefined') {
      console.log("Checking user profile...");
      await checkUserProfile(result.user.uid);
      console.log(checkUserProfile(result.user.uid));

    }
  } catch (error) {
    console.error("Error signing in:", error);
  }
};

const checkUserProfile = async (userId: string) => {
  try {
    const db = getFirestore(firebaseApp);
    const userDocRef = doc(db, 'users', userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();

      // Check if all profile fields are filled
      const requiredFields = [
        'name', 'age', 'gender',
        'selectedCommunicationOption', 'selectedRelationshipOption',
        'selectedStanceOnChildren', 'selectedLifestyle',
        'selectedIdealFirstDate', 'selectedAttitudeTowardsPets',
        'selectedReligionSpirituality', 'selectedConflictResolution',
        'selectedFinancesApproach', 'selectedPhysicalIntimacy'
      ];
      
      const isProfileComplete = requiredFields.every(field => userData[field]);

      if (isProfileComplete) {
        console.log("Profile complete. Redirecting to /match");
        router.push('/match');
      } else {
        console.log("Profile incomplete. Redirecting to /profile");
        router.push('/profile');
      }
    } else {
      console.log("No profile found. Redirecting to /profile");
      router.push('/profile');
    }
  } catch (error) {
    console.error("Error checking user profile:", error);
    router.push('/profile');
  }
};



  return (
 
    <section className="text-white h-screen relative">


         <div>
   
       {user && (
         <div>
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2"> Welcome,{user.displayName}</label>
            <label htmlFor="name" className="block text-gray-700  font-w400 mb-2"> Please create your profile genuinely</label>
 
         </div>
       )}
</div> 

   
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="logo-container" onClick={signIn}>
      
            <Image
              src="/Logo1.png"
              width={250}
              height={100}
              alt="Logo"
              className="logo"
            />
        
               </div>

      </div>

      {/* Iframe */}
      <iframe
        src="https://saisreesatyassss.github.io/Proposal_Valentine_Special/"
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        className="z-0"
      />

      {/* CSS */}
      <style jsx>{` 
      

    @media (max-width: 768px) {
        .logo {
 
           width: 150px !important;
            height: auto !important;
        }
    }


        /* Logo blinking animation */
        @keyframes blink {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }

        .logo-container {
          animation: blink 1s infinite alternate;
        }

        .logo {
          display: block;
        }
      `}</style>
    </section>
  );
}
 
export default Main;
