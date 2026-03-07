import { useEffect, useState } from "react"
import API from "../services/api"
import NoteEditor from "../components/NoteEditor"

import {
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  PencilIcon,
  UserPlusIcon,
  BellIcon,
  UserGroupIcon,
  ClockIcon,
  CheckIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline"
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid"

export default function Dashboard() {
  const [notes, setNotes] = useState([])
  const [invites, setInvites] = useState([])

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [search, setSearch] = useState("")

  const [editingNote, setEditingNote] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [showInvites, setShowInvites] = useState(true)

  const [deleteId, setDeleteId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [inviteNoteId, setInviteNoteId] = useState(null)
  const [inviteEmail, setInviteEmail] = useState("")
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState("")

  const [searchDebounce, setSearchDebounce] = useState(null)

  useEffect(() => {
    fetchNotes()
    fetchInvites()
  }, [])

  // Debounced search
  useEffect(() => {
    if (searchDebounce) {
      clearTimeout(searchDebounce)
    }
    const timer = setTimeout(() => {
      fetchNotes()
    }, 500)
    setSearchDebounce(timer)
    return () => clearTimeout(timer)
  }, [search])

  const fetchNotes = async () => {
    try {
      setIsLoading(true)
      const res = await API.get(`/notes?search=${search}`)
      setNotes(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchInvites = async () => {
    try {
      const res = await API.get("/invites")
      setInvites(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const saveNote = async () => {
    if (!title.trim()) return

    try {
      setIsLoading(true)
      if (editingNote) {
        await API.put(`/notes/${editingNote}`, {
          title,
          content
        })
      } else {
        await API.post("/notes", {
          title,
          content
        })
      }

      setTitle("")
      setContent("")
      setEditingNote(null)
      setIsCreating(false)
      fetchNotes()
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const openDeleteModal = (id) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true)
      await API.delete(`/notes/${deleteId}`)
      fetchNotes()
      setShowDeleteModal(false)
    } catch (err) {
      console.error(err)
    } finally {
      setDeleteLoading(false)
      setDeleteId(null)
    }
  }

  const editNote = (note) => {
    setEditingNote(note._id)
    setTitle(note.title)
    setContent(note.content)
    setIsCreating(true)
  }

  const openInviteModal = (id) => {
    setInviteNoteId(id)
    setInviteEmail("")
    setInviteError("")
    setShowInviteModal(true)
  }

  const sendInvite = async () => {
    if (!inviteEmail.trim()) {
      setInviteError("Email is required")
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(inviteEmail)) {
      setInviteError("Please enter a valid email")
      return
    }

    try {
      setInviteLoading(true)
      setInviteError("")
      await API.post("/invites", {
        noteId: inviteNoteId,
        email: inviteEmail
      })

      setInviteEmail("")
      setShowInviteModal(false)
      fetchInvites()
    } catch (err) {
      setInviteError(err.response?.data?.message || "Failed to send invite")
    } finally {
      setInviteLoading(false)
    }
  }

  const acceptInvite = async (id) => {
    try {
      await API.put(`/invites/accept/${id}`)
      fetchInvites()
      fetchNotes()
    } catch (err) {
      console.error(err)
    }
  }

  const rejectInvite = async (id) => {
    try {
      await API.put(`/invites/reject/${id}`)
      fetchInvites()
    } catch (err) {
      console.error(err)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    window.location = "/login"
  }

  const clearSearch = () => {
    setSearch("")
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  CollabNotes
                </h1>
                <p className="text-xs text-slate-500">Collaborative workspace</p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              {/* Invites bell */}
              {invites.length > 0 && (
                <button
                  onClick={() => setShowInvites(!showInvites)}
                  className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs flex items-center justify-center rounded-full shadow-sm">
                    {invites.length}
                  </span>
                </button>
              )}

              {/* Logout button */}
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-slate-200 text-sm font-medium rounded-lg text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Invites Panel */}
        {invites.length > 0 && showInvites && (
          <div className="mb-8 animate-slideDown">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <UserGroupIcon className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-slate-800">
                        Pending Invitations
                      </h2>
                      <p className="text-xs text-slate-500">
                        You have {invites.length} pending {invites.length === 1 ? 'invitation' : 'invitations'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowInvites(false)}
                    className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {invites.map((invite) => (
                  <div key={invite._id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">
                            Invited to collaborate on
                          </p>
                          <p className="font-medium text-slate-800">
                            {invite.note?.title || "Untitled Note"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => acceptInvite(invite._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors text-sm font-medium"
                        >
                          <CheckIcon className="h-4 w-4 mr-1" />
                          Accept
                        </button>
                        <button
                          onClick={() => rejectInvite(invite._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                        >
                          <XMarkIcon className="h-4 w-4 mr-1" />
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">My Notes</h2>
              <p className="text-sm text-slate-500 mt-1">
                {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} • 
                {notes.filter(n => !n.owner).length} shared with you
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                {notes.length} total
              </span>
            </div>
          </div>
        </div>

        {/* Search and Create */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Search notes by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            {!isCreating ? (
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow md:w-auto w-full"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Note
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsCreating(false)
                  setEditingNote(null)
                  setTitle("")
                  setContent("")
                }}
                className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 text-sm font-medium rounded-xl text-slate-600 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200 shadow-sm md:w-auto w-full"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Create/Edit Note Form */}
        {isCreating && (
          <div className="mb-8 animate-slideDown">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    {editingNote ? (
                      <PencilIcon className="h-5 w-5 text-blue-600" />
                    ) : (
                      <PlusIcon className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">
                      {editingNote ? "Edit Note" : "Create New Note"}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {editingNote ? "Update your note content" : "Fill in the details below"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-600 mb-1">
                      Note Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      className="block w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Meeting Notes, Project Ideas..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Content
                    </label>
                    <div className="border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                      <NoteEditor content={content} setContent={setContent} />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={saveNote}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          {editingNote ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        editingNote ? "Update Note" : "Create Note"
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setIsCreating(false)
                        setEditingNote(null)
                        setTitle("")
                        setContent("")
                      }}
                      className="inline-flex items-center px-4 py-2 border border-slate-200 text-sm font-medium rounded-lg text-slate-600 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !isCreating && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <DocumentTextIcon className="h-6 w-6 text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-4">Loading your notes...</p>
          </div>
        )}

        {/* Notes Grid */}
        {!isLoading && (
          <>
            {/* Empty State */}
            {filteredNotes.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full inline-flex mx-auto mb-4">
                  <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  {search ? "No matching notes" : "No notes yet"}
                </h3>
                <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                  {search
                    ? "We couldn't find any notes matching your search. Try different keywords."
                    : "Get started by creating your first note. It's quick and easy!"}
                </p>
                {!isCreating && !search && (
                  <button
                    onClick={() => setIsCreating(true)}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create your first note
                  </button>
                )}
                {search && (
                  <button
                    onClick={clearSearch}
                    className="inline-flex items-center px-6 py-3 border border-slate-200 text-sm font-medium rounded-xl text-slate-600 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}

            {/* Notes Grid */}
            {filteredNotes.length > 0 && (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Showing {filteredNotes.length} of {notes.length} notes
                  </p>
                  {search && (
                    <button
                      onClick={clearSearch}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear search
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNotes.map((note) => (
                    <article
                      key={note._id}
                      className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-slate-200 overflow-hidden transition-all duration-200 hover:-translate-y-1"
                    >
                      {/* Color header based on ownership */}
                      <div className={`h-2 ${
                        note.owner ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      }`}></div>

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h2 className="text-lg font-semibold text-slate-800 line-clamp-1 flex-1">
                            {note.title}
                          </h2>

                          {/* Action buttons */}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                            {note.owner && (
                              <>
                                <button
                                  onClick={() => editNote(note)}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit note"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => openInviteModal(note._id)}
                                  className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                  title="Invite collaborator"
                                >
                                  <UserPlusIcon className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => openDeleteModal(note._id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete note"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Content preview */}
                        <div
                          className="prose prose-sm max-w-none text-slate-600 mb-4 line-clamp-3"
                          dangerouslySetInnerHTML={{
                            __html: note.content || '<span class="text-slate-400 italic">No content</span>'
                          }}
                        />

                        {/* Metadata */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div className="flex items-center space-x-2">
                            {!note.owner && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700">
                                <UserGroupIcon className="h-3 w-3 mr-1" />
                                Shared
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-xs text-slate-400">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            <time>
                              {new Date(note.updatedAt || note.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </time>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Delete Note</h2>
                  <p className="text-sm text-slate-500">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this note? All content will be permanently removed.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 bg-white hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {deleteLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete Note'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <UserPlusIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Invite Collaborator</h2>
                  <p className="text-sm text-slate-500">Send an invitation to collaborate</p>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="collaborator@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      inviteError ? 'border-red-300 bg-red-50' : 'border-slate-200'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  />
                </div>
                {inviteError && (
                  <p className="mt-1 text-xs text-red-600">{inviteError}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 bg-white hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={sendInvite}
                  disabled={inviteLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {inviteLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    'Send Invite'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      
    </div>
  )
}