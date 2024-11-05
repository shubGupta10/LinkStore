'use client'
import axios from 'axios'
import React, { useState } from 'react'
import { Edit3 } from 'lucide-react'

interface UpdateLinkProps {
  linkId: string
  initialLinkName: string
  initialActualLink: string
}

const UpdateLink: React.FC<UpdateLinkProps> = ({ linkId, initialLinkName, initialActualLink }) => {
  const [linkName, setLinkName] = useState<string>(initialLinkName || '')
  const [actualLink, setActualLink] = useState<string>(initialActualLink || '')
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const updateLink = async () => {
    try {
      await axios.patch('/api/updateLink', {
        linkId,
        linkName,
        ActualLink: actualLink,
      })
      alert('Link updated successfully')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating link:', error)
      alert('Failed to update link')
    }
  }

  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <button onClick={() => setIsEditing(!isEditing)}>
        <Edit3 className="text-blue-500 hover:text-blue-700" />
      </button>

      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={linkName}
            onChange={(e) => setLinkName(e.target.value)}
            placeholder="Link Name"
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="url"
            value={actualLink}
            onChange={(e) => setActualLink(e.target.value)}
            placeholder="Link URL"
            className="p-2 border border-gray-300 rounded"
          />
          <button
            onClick={updateLink}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      ) : (
        <div>
          <p className="font-semibold">{linkName}</p>
          <p className="text-blue-600">{actualLink}</p>
        </div>
      )}
    </div>
  )
}

export default UpdateLink
