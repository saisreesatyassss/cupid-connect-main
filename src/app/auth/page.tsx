


// 'use client';

// import { useState } from 'react';
// import { firebaseApp } from '../../lib/firebaseConfig';
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   sendPasswordResetEmail,
//   signOut,
//   User
// } from 'firebase/auth';

// const auth = getAuth(firebaseApp);

// export default function AuthComponent() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [user, setUser] = useState<User | null>(null);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   // Email validation function
//   const isValidEmail = (email: string) => {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   };

//   // Register function
//   const handleRegister = async () => {
//     setError('');
//     setSuccessMessage('');

//     if (!isValidEmail(email)) {
//       setError('Invalid email format. Please enter a valid email.');
//       return;
//     }

//     if (password.length < 6) {
//       setError('Password must be at least 6 characters long.');
//       return;
//     }

//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       setUser(userCredential.user);
//       setSuccessMessage('Account created successfully!');
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   // Login function
//   const handleSignIn = async () => {
//     setError('');
//     setSuccessMessage('');

//     if (!isValidEmail(email)) {
//       setError('Invalid email format. Please enter a valid email.');
//       return;
//     }

//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       setUser(userCredential.user);
//       setSuccessMessage('Login successful!');
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   // Forgot Password function
//   const handleForgotPassword = async () => {
//     setError('');
//     setSuccessMessage('');

//     if (!isValidEmail(email)) {
//       setError('Please enter a valid email to reset your password.');
//       return;
//     }

//     try {
//       await sendPasswordResetEmail(auth, email);
//       setSuccessMessage('Password reset email sent! Check your inbox.');
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   // Logout function
//   const handleSignOut = async () => {
//     setError('');
//     setSuccessMessage('');

//     try {
//       await signOut(auth);
//       setUser(null);
//       setSuccessMessage('You have logged out.');
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
//       <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
//         <h2 className="text-2xl font-semibold text-center mb-4">Firebase Auth</h2>
//         {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//         {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
        
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-2 border rounded mb-3"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 border rounded mb-3"
//         />
        
//         <button
//           onClick={handleRegister}
//           className="w-full bg-blue-500 text-white p-2 rounded mb-2 hover:bg-blue-600"
//         >
//           Register
//         </button>
        
//         <button
//           onClick={handleSignIn}
//           className="w-full bg-green-500 text-white p-2 rounded mb-2 hover:bg-green-600"
//         >
//           Sign In
//         </button>
        
//         <button
//           onClick={handleForgotPassword}
//           className="w-full bg-yellow-500 text-white p-2 rounded mb-2 hover:bg-yellow-600"
//         >
//           Forgot Password
//         </button>

//         {user && (
//           <button
//             onClick={handleSignOut}
//             className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
//           >
//             Sign Out
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { firebaseApp } from '../../lib/firebaseConfig';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  User,
  getRedirectResult
} from 'firebase/auth';
import { useRouter } from 'next/navigation'; 
import { doc, getDoc, getFirestore } from 'firebase/firestore';

const auth = getAuth(firebaseApp);

export default function AuthComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Email validation function
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const router = useRouter();

  // Register function
  const handleRegister = async () => {
    setError('');
    setSuccessMessage('');

    if (!isValidEmail(email)) {
      setError('Invalid email format. Please enter a valid email.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setSuccessMessage('Account created successfully! Please verify your email.');

      // Send email verification
      await sendEmailVerification(userCredential.user);
      setSuccessMessage('Verification email sent. Please check your inbox.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Login function
  const handleSignIn = async () => {
    setError('');
    setSuccessMessage('');

    if (!isValidEmail(email)) {
      setError('Invalid email format. Please enter a valid email.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);

      if (!userCredential.user.emailVerified) {
        setError('Email not verified. Please check your inbox.');
        return;
      }

      setSuccessMessage('Login successful!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Forgot Password function
  const handleForgotPassword = async () => {
    setError('');
    setSuccessMessage('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email to reset your password.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Logout function
  const handleSignOut = async () => {
    setError('');
    setSuccessMessage('');

    try {
      await signOut(auth);
      setUser(null);
      setSuccessMessage('You have logged out.');
    } catch (err: any) {
      setError(err.message);
    }
  };

const initializeAuth = () => { 
 if (user) {
    setUser(user); 
    checkUserProfile(user.uid);
  }
};

// Assuming 'user' is coming from your auth context or state
useEffect(() => {
  if (user) {
    initializeAuth();
  }
}, [user]); 

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">Firebase Auth</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        
        <button
          onClick={handleRegister}
          className="w-full bg-blue-500 text-white p-2 rounded mb-2 hover:bg-blue-600"
        >
          Register
        </button>
        
        <button
          onClick={handleSignIn}
          className="w-full bg-green-500 text-white p-2 rounded mb-2 hover:bg-green-600"
        >
          Sign In
        </button>
        
        <button
          onClick={handleForgotPassword}
          className="w-full bg-yellow-500 text-white p-2 rounded mb-2 hover:bg-yellow-600"
        >
          Forgot Password
        </button>

        {user && (
          <button
            onClick={handleSignOut}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}
