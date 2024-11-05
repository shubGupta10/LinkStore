'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link2, Search, Shield, ChevronRight, Github } from 'lucide-react'
import { useRouter } from 'next/navigation'

const Home = () => {
  const router = useRouter()

  const handleLogin = () => {
    router.push('/Auth/login')
  }

  const handleRegister = () => {
    router.push('/Auth/Register')
  }


  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <main className="flex-grow container mx-auto px-4 mt-20 py-12">
        <div className="max-w-4xl mx-auto space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-500">
              Save Your Links in One Place
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              A simple and secure way to store, organize, and find your important links whenever you need them.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Button onClick={handleLogin} size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                Start Saving Links <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Link2 className="h-8 w-8 text-blue-500" />}
              title="Easy Link Storage"
              description="Save your links with a single click. Add notes to remember why you saved them."
            />
            <FeatureCard
              icon={<Search className="h-8 w-8 text-blue-500" />}
              title="Quick Search"
              description="Find your saved links instantly using simple search and filters."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-blue-500" />}
              title="Secure Storage"
              description="Your links are safely stored and only accessible to you."
            />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-900 rounded-lg p-8 shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-6 text-blue-400">Simple and Effective</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <ChevronRight className="h-5 w-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                <span>Save links from any browser with our extension</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="h-5 w-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                <span>Organize links into folders to keep things tidy</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="h-5 w-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                <span>Access your links from any device</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="h-5 w-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                <span>Find links quickly with search and tags</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-6 text-blue-400">Start Saving Your Links Today</h2>
            <Button onClick={handleRegister} size="lg" className="bg-blue-600 hover:bg-blue-700">
              Create Free Account
            </Button>
          </motion.div>
        </div>
      </main>

      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm text-gray-400">&copy; 2024 LinkStore. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                Terms of Service
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="bg-gray-900 border-gray-800">
    <CardContent className="p-6 text-center space-y-4">
      <div className="flex justify-center">{icon}</div>
      <h2 className="text-xl font-semibold text-blue-400">{title}</h2>
      <p className="text-gray-300">{description}</p>
    </CardContent>
  </Card>
)

export default Home