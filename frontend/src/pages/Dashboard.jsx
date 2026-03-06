import { useEffect, useState } from "react"
import API from "../services/api"
import NoteEditor from "../components/NoteEditor"
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  TrashIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [search, setSearch] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      setIsLoading(true)
      const res = await API.get("/notes")
      setNotes(res.data)
    } catch (error) {
      console.error("Error fetching notes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const createNote = async () => {
    if (!title.trim()) {
      alert("Please enter a title")
      return
    }

    try {
      setIsLoading(true)
      await API.post("/notes", { title, content })
      
      setTitle("")
      setContent("")
      setIsCreating(false)
      await fetchNotes()
    } catch (error) {
      console.error("Error creating note:", error)
      alert("Failed to create note. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteNote = async (id) => {
    if (!confirm("Are you sure you want to delete this note?")) return

    try {
      setIsLoading(true)
      await API.delete(`/notes/${id}`)
      await fetchNotes()
    } catch (error) {
      console.error("Error deleting note:", error)
      alert("Failed to delete note. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    window.location = "/login"
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                CollabNotes
              </h1>
            </div>
            
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Stats */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Notes</h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} total
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              {notes.length} total
            </span>
          </div>
        </div>

        {/* Search and Create Button - Horizontal Layout */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Search your notes by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {!isCreating ? (
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm hover:shadow md:w-auto w-full"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Note
              </button>
            ) : (
              <button
                onClick={() => setIsCreating(false)}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 shadow-sm md:w-auto w-full"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Create Note Form - Slides down when active */}
        {isCreating && (
          <div className="mb-8 animate-slideDown">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <PlusIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Create New Note</h2>
                    <p className="text-xs text-gray-500">Fill in the details below</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Note Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Meeting Notes, Project Ideas, To-Do List..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                    </label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                      <NoteEditor content={content} setContent={setContent} />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={createNote}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        'Create Note'
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsCreating(false)
                        setTitle("")
                        setContent("")
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
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
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <DocumentTextIcon className="h-5 w-5 text-blue-600 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        {!isLoading && (
          <>
            {/* Empty State */}
            {filteredNotes.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <div className="p-4 bg-blue-50 rounded-full inline-flex mx-auto mb-4">
                  <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {search ? "No matching notes" : "No notes yet"}
                </h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                  {search 
                    ? "We couldn't find any notes matching your search. Try different keywords."
                    : "Get started by creating your first note. It's quick and easy!"}
                </p>
                {!isCreating && !search && (
                  <button
                    onClick={() => setIsCreating(true)}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm hover:shadow"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create your first note
                  </button>
                )}
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
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
                  <p className="text-sm text-gray-500">
                    Showing {filteredNotes.length} of {notes.length} notes
                  </p>
                  {search && (
                    <button
                      onClick={() => setSearch("")}
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
                      className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:-translate-y-1"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h2 className="text-lg font-semibold text-gray-900 line-clamp-1 flex-1">
                            {note.title}
                          </h2>
                          <button
                            onClick={() => deleteNote(note._id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                            title="Delete note"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div 
                          className="prose prose-sm max-w-none text-gray-600 mb-4 line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: note.content || '<span class="text-gray-400 italic">No content</span>' }}
                        />
                        
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-400 flex items-center">
                            <DocumentTextIcon className="h-3 w-3 mr-1" />
                            Note
                          </span>
                          <time className="text-xs text-gray-400">
                            {new Date(note.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </time>
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

    </div>
  )
}