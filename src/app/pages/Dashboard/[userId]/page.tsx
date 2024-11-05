'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useFirebase } from '@/context'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ExternalLink, Calendar, Loader2, Trash2, Copy, Plus, Search, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import AddLink from '@/components/AddLink'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LinkItem {
  _id: string
  linkName: string
  actualLink: string
  createdAt: string
}

interface EditDialogProps {
  isOpen: boolean
  onClose: () => void
  linkItem: LinkItem | null
  onSave: (linkId: string, data: { linkName: string; actualLink: string }) => Promise<void>
}

const EditDialog: React.FC<EditDialogProps> = ({ isOpen, onClose, linkItem, onSave }) => {
  const [linkName, setLinkName] = useState(linkItem?.linkName ?? '')
  const [actualLink, setActualLink] = useState(linkItem?.actualLink ?? '')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (linkItem) {
      setLinkName(linkItem.linkName)
      setActualLink(linkItem.actualLink)
    }
  }, [linkItem])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!linkItem) return

    try {
      setIsSaving(true)
      await onSave(linkItem._id, { linkName, actualLink })
      onClose()
      toast.success('Link updated successfully')
    } catch (error) {
      toast.error('Failed to update link')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Edit Link</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Update your link details below
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="linkName" className="text-zinc-200">Link Name</Label>
            <Input
              id="linkName"
              value={linkName}
              onChange={(e) => setLinkName(e.target.value)}
              placeholder="Enter link name"
              required
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="actualLink" className="text-zinc-200">URL</Label>
            <Input
              id="actualLink"
              value={actualLink}
              onChange={(e) => setActualLink(e.target.value)}
              placeholder="Enter URL"
              required
              type="url"
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const Dashboard: React.FC = () => {
  const { token, userData } = useFirebase()
  const [data, setData] = useState<LinkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null)

  const fetchLinksByUser = async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      if (!userData?.uid) {
        setError('User ID is required')
        return
      }

      const response = await axios.get('/api/FetchLinks', {
        params: { userId: userData.uid }
      })

      if (response.data.success) {
        setData(response.data.links)
      } else {
        setError(response.data.message || 'Failed to fetch links')
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch links. Please try again later.')
      console.error('Error fetching links by user:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateLink = async (linkId: string, updateData: { linkName: string; actualLink: string }): Promise<void> => {
    try {
      await axios.patch('/api/updateLink', { 
        linkId, 
        ...updateData,
        userId: userData?.uid 
      })
      await fetchLinksByUser()
    } catch (error) {
      throw new Error('Failed to update link')
    }
  }

  const deleteLink = async (linkId: string): Promise<void> => {
    try {
      setDeletingId(linkId)
      const response = await axios.delete('/api/deleteLink', {
        data: { 
          linkId,
          userId: userData?.uid 
        }
      })
      if (response.status === 200) {
        setData(prevData => prevData.filter(item => item._id !== linkId))
        toast.success('Link deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting link:', error)
      toast.error('Failed to delete link. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text)
    toast.success('Link copied to clipboard')
  }

  useEffect(() => {
    if (userData?.uid) {
      fetchLinksByUser()
    }
  }, [userData?.uid])

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.linkName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.actualLink.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data, searchTerm])

  if (!token) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-black">
        <Alert className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
          <AlertTitle className="text-white text-xl font-extrabold">Hey!</AlertTitle>
          <AlertDescription className="text-white text-lg mt-2">
            User must be logged in to see their links. If you are new to this, visit{' '}
            <a href='/Auth/Register' className="underline text-blue-400 hover:text-blue-300 transition-colors">
              Sign Up
            </a>.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-black">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-20 bg-red-900/50 border-red-900">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 pt-20">
      <div className="container mx-auto mt-12 px-4 space-y-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100">Your Links</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                <Plus className="mr-2 h-5 w-5" /> Add New Link
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800">
              <DialogHeader>
                <DialogTitle className="text-zinc-100">Add New Link</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Create a new shortened link here.
                </DialogDescription>
              </DialogHeader>
              <AddLink onSuccess={fetchLinksByUser} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-5 w-5" />
          <Input
            type="search"
            placeholder="Search links..."
            className="pl-10 h-12 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredData.length === 0 ? (
          <Alert className="max-w-xl mx-auto bg-zinc-900/50 border-zinc-800">
            <AlertDescription className="text-zinc-300">
              {searchTerm ? "No links found matching your search." : "No links found. Start by adding some links!"}
            </AlertDescription>
          </Alert>
        ) : (
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-4 pr-4">
              {filteredData.map((item) => (
                <Card key={item._id} className="bg-zinc-900 border-zinc-800 transition-all hover:bg-zinc-800/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-semibold truncate text-zinc-100">
                      {item.linkName}
                    </CardTitle>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(item.actualLink)}
                        className="hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100"
                        aria-label="Copy link"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingLink(item)}
                        className="hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100"
                        aria-label="Edit link"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLink(item._id)}
                        disabled={deletingId === item._id}
                        className="hover:bg-red-900/20 text-red-400 hover:text-red-300"
                        aria-label="Delete link"
                      >
                        {deletingId === item._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={item.actualLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center space-x-2 truncate group"
                    >
                      <ExternalLink className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="truncate">{item.actualLink}</span>
                    </a>
                    <div className="text-zinc-500 mt-2 text-sm flex items-center space-x-2">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <time dateTime={item.createdAt}>
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}

        <EditDialog
          isOpen={editingLink !== null}
          onClose={() => setEditingLink(null)}
          linkItem={editingLink}
          onSave={updateLink}
        />
      </div>
    </div>
  )
}

export default Dashboard