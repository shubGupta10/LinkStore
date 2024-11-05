'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { firebaseApp } from '@/Firebase/FirebaseConfig'

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface FirebaseContextType {
  token: string;
  setToken: (token: string) => void;
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  isLoading: boolean;
}

const MyAppContext = createContext<FirebaseContextType | undefined>(undefined)

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string>('')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const auth = getAuth(firebaseApp)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Load initial data from localStorage
        const savedToken = localStorage.getItem('userToken')
        const savedUserData = localStorage.getItem('userData')
        
        if (savedToken) setToken(savedToken)
        if (savedUserData) {
          const parsedUserData = JSON.parse(savedUserData) as UserData
          setUserData(parsedUserData)
        }
      } catch (error) {
        console.error('Error loading saved auth state:', error)
        // Clear potentially corrupted data
        localStorage.removeItem('userToken')
        localStorage.removeItem('userData')
      }
    }

    initializeAuth()

    // Set up Firebase auth state observer
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      setIsLoading(true)
      
      try {
        if (user) {
          // User is signed in
          const newToken = await user.getIdToken()
          setToken(newToken)
          localStorage.setItem('userToken', newToken)
          
          const newUserData: UserData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          }
          setUserData(newUserData)
          localStorage.setItem('userData', JSON.stringify(newUserData))
        } else {
          // User is signed out
          setToken('')
          setUserData(null)
          localStorage.removeItem('userToken')
          localStorage.removeItem('userData')
        }
      } catch (error) {
        console.error('Error handling auth state change:', error)
        // Handle error appropriately
        setToken('')
        setUserData(null)
        localStorage.removeItem('userToken')
        localStorage.removeItem('userData')
      } finally {
        setIsLoading(false)
      }
    })

    // Cleanup subscription
    return () => unsubscribe()
  }, [auth])

  const contextValue: FirebaseContextType = {
    token,
    setToken,
    userData,
    setUserData,
    isLoading
  }

  return (
    <MyAppContext.Provider value={contextValue}>
      {children}
    </MyAppContext.Provider>
  )
}

export function useFirebase(): FirebaseContextType {
  const context = useContext(MyAppContext)
  if (context === undefined) {
    throw new Error('useFirebase must be used within an AppWrapper')
  }
  return context
}