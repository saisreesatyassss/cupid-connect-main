"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, getRedirectResult } from "firebase/auth";
import { firebaseApp } from "../../lib/firebaseConfig"; // Your Firebase initialization

const AuthPage = () => {
  const router = useRouter();
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          console.log("User signed in:", result.user);

          // Save user data locally
          localStorage.setItem("user", JSON.stringify(result.user));

          // Redirect to the home page
          router.push("/");
        }
      })
      .catch((error) => {
        console.error("Sign-in error:", error);
      });
  }, []);

  return <h2>Authenticating...</h2>;
};

export default AuthPage;
