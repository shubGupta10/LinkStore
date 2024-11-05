'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebase } from '@/context';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Home, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import { firebaseApp } from '@/Firebase/FirebaseConfig';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
}

const Navbar: React.FC = () => {
  const auth = getAuth(firebaseApp);
  const router = useRouter();
  const { token, setToken, userData, setUserData, isLoading } = useFirebase();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  // Define nav items with authentication requirement
  const navItems: NavItem[] = [
    { 
      name: 'Home', 
      href: '/', 
      icon: <Home className="w-4 h-4 mr-2" />,
      requiresAuth: false 
    },
    { 
      name: 'Dashboard', 
      href: userData?.uid ? `/pages/Dashboard/${userData.uid}` : '/', 
      icon: <LayoutDashboard className="w-4 h-4 mr-2" />,
      requiresAuth: true 
    }
  ];

  // Filter nav items based on authentication status
  const filteredNavItems = navItems.filter(item => 
    !item.requiresAuth || (item.requiresAuth && token && userData)
  );

  const handleTakemetoSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(false);
      await router.push('/Auth/login');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      await signOut(auth);
      setToken('');
      setUserData(null);
      setIsOpen(false);
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      await router.push('/Auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavItemClick = () => {
    setIsOpen(false);
  };

  if (isLoading) {
    return null;
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'}`}
      initial={false}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition duration-300">
            Link Store
          </Link>

          <div className="hidden md:flex space-x-6 items-center">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center text-white hover:text-blue-400 transition duration-300"
                onClick={handleNavItemClick}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}

            {token ? (
              <Button
                className="text-white bg-red-700 hover:bg-red-900"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            ) : (
              <Button
                variant="outline"
                className="text-black border-white hover:bg-gray-400 hover:text-black transition duration-300"
                onClick={handleTakemetoSignIn}
              >
                Sign In
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            className="md:hidden text-white hover:text-blue-400 transition duration-300"
            onClick={toggleMenu}
          >
            {isOpen ? <X className="h-14 w-14" /> : <Menu className="h-14 w-14" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/90 backdrop-blur-md"
          >
            <div className="flex flex-col space-y-4 p-4">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center text-white hover:text-blue-400 transition duration-300"
                  onClick={handleNavItemClick}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              {token ? (
                <Button
                  className="bg-red-600 text-white hover:bg-red-700 !important transition duration-300"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="text-black border-white hover:bg-gray-400 hover:text-black transition duration-300"
                  onClick={handleTakemetoSignIn}
                >
                  Sign In
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;