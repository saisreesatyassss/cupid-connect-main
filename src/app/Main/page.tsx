// Import the necessary libraries
"use client";
import React, { useState } from 'react'; 
import Image from 'next/image'; 
import { useRouter } from 'next/navigation'; 
import { firebaseApp} from "../../lib/firebaseConfig";
import { Home,HomeIcon, Settings } from "lucide-react";


import { GoogleAuthProvider, User, getAuth, signInWithPopup } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';
import FloatingWidget from '../FloatingWidget';
import { signInWithRedirect, getRedirectResult } from "firebase/auth";

//  import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";

 
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
    
    // Detect iOS device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ;
    
    if (isIOS) {
      // Use redirect method for iOS
      await signInWithRedirect(auth, provider);
      
      // Handle redirect result
      const result = await getRedirectResult(auth);
      
      if (result) {
        setUser(result.user);
        
        if (typeof window !== 'undefined') {
          console.log("Checking user profile...");
          await checkUserProfile(result.user.uid);
        }
      }
    } else {
      // Use popup for non-iOS devices
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);

      if (typeof window !== 'undefined') {
        console.log("Checking user profile...");
        await checkUserProfile(result.user.uid);
      }
    }
  } catch (error) {
    console.error("Error signing in:", error);
    // Add more specific error handling
    // if (error.code === 'auth/popup-blocked') {
    //   console.error("Popup was blocked. Please allow popups and try again.");
    // } else if (error.code === 'auth/cancelled-popup-request') {
    //   console.error("Sign-in was cancelled.");
    // } else if (error.code === 'auth/popup-closed-by-user') {
    //   console.error("Sign-in window was closed.");
    // }
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

    //     <section className="text-white h-screen relative flex items-center justify-center">
    //    <div
    //     className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 animate-pulse cursor-pointer"
    //     onClick={signIn}
    //   >
    //     <Image
    //       src="/Logo1.png"
    //       width={250}
    //       height={100}
    //       alt="Logo"
    //       className="w-[250px] md:w-[150px] transition-transform duration-500 hover:scale-110"
    //     />
    //   </div>

    //    <iframe
    //     src="https://saisreesatyassss.github.io/Proposal_Valentine_Special/"
    //     className="absolute inset-0 w-full h-full z-0"
    //     frameBorder="0"
    //     allowFullScreen
    //   />
    // </section>
  );
}
 
export default Main;
