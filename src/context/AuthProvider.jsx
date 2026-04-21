import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.init.js";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // AUTH FUNCTIONS
  // =========================

  const createUserWithEmailAndPasswordFunc = async (email, password) => {
  setLoading(true);
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result;
  } finally {
    setLoading(false); // ✅ ALWAYS run করবে
  }
};

  const updateProfileFunc = (displayName, photoURL) => {
    return updateProfile(auth.currentUser, { displayName, photoURL });
  };

  const sendEmailVerificationFunc = () => {
    return sendEmailVerification(auth.currentUser);
  };

  const signInWithEmailAndPasswordFunc = async (email, password) => {
  setLoading(true);
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } finally {
    setLoading(false);
  }
};

  const signInWithGoogleFunc = async () => {
  setLoading(true);
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } finally {
    setLoading(false);
  }
};

  const signInWithGithubFunc = async () => {
  setLoading(true);
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return result;
  } finally {
    setLoading(false);
  }
};

  const signoutUserFunc = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setToken(null);
    localStorage.removeItem("access-token");
    setLoading(false);
  };

  const sendPassResetEmailFunc = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // =========================
  // AUTH STATE OBSERVER
  // =========================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const idToken = await currentUser.getIdToken(true);

          setUser(currentUser);
          setToken(idToken);
          localStorage.setItem("access-token", idToken);
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem("access-token");
        }
      } catch (error) {
        console.error("Auth state error:", error);
        setUser(null);
        setToken(null);
        localStorage.removeItem("access-token");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // =========================
  // CONTEXT VALUE
  // =========================

  const authInfo = {
    user,
    token,
    loading,
    setUser,
    setLoading,

    createUserWithEmailAndPasswordFunc,
    signInWithEmailAndPasswordFunc,
    signInWithGoogleFunc,
    signInWithGithubFunc,
    signoutUserFunc,
    sendPassResetEmailFunc,
    sendEmailVerificationFunc,
    updateProfileFunc,
  };

  // =========================
  // LOADING UI
  // =========================

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;