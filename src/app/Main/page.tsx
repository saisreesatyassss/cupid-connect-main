// Import the necessary libraries
"use client";
import React, { useEffect, useState } from 'react'; 
import Image from 'next/image'; 
import { useRouter } from 'next/navigation'; 
import { firebaseApp} from "../../lib/firebaseConfig";
import { Home,HomeIcon, Settings } from "lucide-react";


import { GoogleAuthProvider, User, getAuth, getRedirectResult, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';
import FloatingWidget from '../FloatingWidget';

 
 
const auth = getAuth(firebaseApp);
 
function Main() {

const [user, setUser] = useState<User | null>(null);
const router = useRouter();

 

// const signIn = async () => {
//   try {
//     const currentUser = auth.currentUser;
    
//     if (currentUser) {
//       console.log("User is already signed in.");
//       await checkUserProfile(currentUser.uid);
//       return;
//     }

//     const provider = new GoogleAuthProvider();
//     const result = await signInWithPopup(auth, provider);
//     setUser(result.user);

//     if (typeof window !== 'undefined') {
//       console.log("Checking user profile...");
//       await checkUserProfile(result.user.uid);
//       console.log(checkUserProfile(result.user.uid));

//     }
//   } catch (error) {
//     console.error("Error signing in:", error);
//   }
// };



// Helper function to detect iOS
const isIOS = () => {
  if (typeof window === 'undefined') return false;
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
};

const signIn = async () => {
  try {
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      console.log("User is already signed in.");
      await checkUserProfile(currentUser.uid);
      return;
    }

    const provider = new GoogleAuthProvider();
    
    // Add additional scopes if needed
    provider.addScope('profile');
    provider.addScope('email');
    
    let result;

    if (isIOS()) {
      // Redirect iOS users to /auth page before signing in
      window.location.href = '/auth';
      return;
    } else {
      // For non-iOS devices, use popup sign-in
      result = await signInWithPopup(auth, provider);
    }

    // If we reach here, we have a result
    if (result && result.user) {
      setUser(result.user);
      
      if (typeof window !== 'undefined') {
        console.log("Checking user profile...");
        await checkUserProfile(result.user.uid);
      }
    }
  } catch (error) {
    if (error === 'auth/popup-blocked') {
      alert('Please allow popups for this website to sign in.');
    } else if (error === 'auth/cancelled-popup-request') {
      console.log('Sign-in cancelled by user');
    } else {
      alert('An error occurred during sign-in. Please try again.');
    }
  }
};

// Function to detect if the device is iOS
// const isIOS = () => {
//   if (typeof window !== 'undefined') {
//     return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
//   }
//   return false;
// };


// Add this to your app's initialization code
const initializeAuth = () => {
  if (typeof window !== 'undefined') {
    // Check for redirect result on page load
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          setUser(result.user);
          checkUserProfile(result.user.uid);
        }
      })
      .catch((error) => {
        console.error("Error getting redirect result:", error);
      });
  }
};

//   useEffect(() => {
// initializeAuth();
//   }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      initializeAuth();
    }, 2000); // Runs every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  

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
