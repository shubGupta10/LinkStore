'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Link as LinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/context/index';
import { DecodeToken } from '@/helpers/jwt';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AddLinkProps {
  onSuccess: () => Promise<void> | void;
}

const AddLink: React.FC<AddLinkProps> = ({ onSuccess }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [linkName, setLinkName] = useState('');
  const [actualLink, setActualLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { token } = useFirebase();
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      if (token) {
        try {
          const response = await DecodeToken(token);
          setUserId(response?.sub || '');
        } catch (err) {
          console.error("Error decoding token:", err);
          setError('Error getting user information');
        }
      }
    };
    fetchUserId();
  }, [token]);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    // Validate inputs
    if (!linkName.trim()) {
      setError('Link name is required');
      setIsLoading(false);
      return;
    }

    if (!actualLink.trim()) {
      setError('Actual link is required');
      setIsLoading(false);
      return;
    }

    if (!validateUrl(actualLink)) {
      setError('Please enter a valid URL (include http:// or https://)');
      setIsLoading(false);
      return;
    }

    if (!userId) {
      setError('User ID not found. Please try logging in again.');
      setIsLoading(false);
      return;
    }

    const linkData = {
      userId,
      linkName: linkName.trim(),
      actualLink: actualLink.trim(),
    };

    try {
      console.log("Sending link data:", linkData);
      
      const response = await axios.post('/api/createLink', linkData);
      console.log("Server response:", response.data);
      
      if (response.status === 200) {
        setSuccess(true);
        setLinkName('');
        setActualLink('');
        await onSuccess?.();
        setTimeout(() => {
          setOpen(false);
          router.push('/pages/Dashboard');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error adding link:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to add link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <LinkIcon className="mr-2 h-4 w-4" />
          Create Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-black text-white">
        <DialogHeader>
          <DialogTitle>Add New Link</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new link.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpload} className="space-y-4 ">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkName">Link Name</Label>
              <Input
                id="linkName"
                placeholder="Enter your link name"
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actualLink">Actual Link</Label>
              <Input
                id="actualLink"
                placeholder="Enter your link URL"
                value={actualLink}
                onChange={(e) => setActualLink(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>Link added successfully!</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="sm:justify-start">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Link...
                </>
              ) : (
                <>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Add Link
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLink;