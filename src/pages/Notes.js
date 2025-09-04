import React, { useEffect, useState, useCallback, useMemo } from "react";
import pdfToText from "react-pdftotext"; // 👈 add this at the top

import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  Token,
} from "../api/api";
import {
  FaEdit,
  FaTrash,
  FaTimes,
  FaSearch,
  FaPlus,
} from "react-icons/fa";


// Utility functions

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(dateString) {
  const d = new Date(dateString);
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Reusable Button component

const Button = ({
  children,
  onClick,
  disabled,
  variant = "primary",
  type = "button",
  className = "",
  ...props
}) => {
  const base =
    "flex items-center gap-2 px-4 py-2 rounded-md transition transform focus:outline-none focus:ring-2 focus:ring-offset-2 ";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400",
    secondary:
      "bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 dark:disabled:bg-gray-700 dark:text-gray-200 dark:focus:ring-gray-500",
    danger:
      "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-400",
    success:
      "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-400",
    warning:
      "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400 dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:focus:ring-yellow-300",
  };

  const disabledClass = disabled ? "cursor-not-allowed opacity-60" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabledClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Tag component
const Tag = ({ name, onClick, isActive = false }) => (
  <span
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyPress={(e) => {
      if (e.key === "Enter" || e.key === " ") onClick();
    }}
    className={`cursor-pointer select-none rounded px-2 py-1 text-xs font-semibold mr-2 mb-2 inline-block transition ${
      isActive
        ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white"
        : "bg-gray-200 text-gray-700 hover:bg-blue-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-blue-600"
    }`}
    aria-pressed={isActive}
  >
    #{name}
  </span>
);


// Toast notification
const Toast = ({ message, type = "info", onClose }) => {
  const colors = {
    info: "bg-blue-600 dark:bg-blue-500",
    success: "bg-green-600 dark:bg-green-500",
    error: "bg-red-600 dark:bg-red-500",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 px-6 py-3 rounded shadow-lg text-white flex items-center gap-4 animate-slide-in ${colors[type]}`}
      role="alert"
      aria-live="assertive"
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        aria-label="Close notification"
        className="font-bold hover:text-gray-300 dark:hover:text-gray-400"
      >
        <FaTimes />
      </button>
    </div>
  );
};

// Modal for delete confirmation
const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel,
  cancelLabel,
}) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2
          id="modal-title"
          className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100"
        >
          {title}
        </h2>
        <div className="mb-6 text-gray-700 dark:text-gray-200">{children}</div>
        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>
            {cancelLabel || "Cancel"}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel || "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Spinner component
const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);
// Floating Modal wrapper for forms
const FloatingModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="floating-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="floating-modal-title"
          className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100"
        >
          {title}
        </h2>
        {children}
        <button
          onClick={onClose}
          aria-label="Close form"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
        >
          <FaTimes size={20} />
        </button>
      </div>
    </div>
  );
};

// NoteForm component
const NoteForm = React.memo(function NoteForm({
  title,
  content,
  tags,
  onTitleChange,
  onContentChange,
  onTagsChange,
  onSubmit,
  isSaving,
  submitLabel = "Add Note",
  showCancel = false,
  onCancel,
  ariaLabelPrefix = "Note form",
}) {
  const isSubmitDisabled = isSaving || (!title.trim() && !content.trim());

  return (
    <form
      onSubmit={onSubmit}
      aria-label={ariaLabelPrefix}
      noValidate
      className="flex flex-col"
    >
      <label htmlFor="note-title" className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
        Title
      </label>
      <input
        id="note-title"
        type="text"
        className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 mb-4"
        placeholder="Title"
        value={title}
        onChange={onTitleChange}
        disabled={isSaving}
        aria-required="true"
        aria-invalid={!title.trim()}
      />
      <label htmlFor="note-content" className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
        Content
      </label>
      <textarea
        id="note-content"
        rows={5}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 mb-4 resize-none"
        placeholder="Write your note here..."
        value={content}
        onChange={onContentChange}
        disabled={isSaving}
        aria-required="true"
        aria-invalid={!content.trim()}
      />
      <label htmlFor="note-tags" className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
        Tags (comma separated)
      </label>
      <input
        id="note-tags"
        type="text"
        className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 mb-6"
        placeholder="e.g. work, personal, ideas"
        value={tags}
        onChange={onTagsChange}
        disabled={isSaving}
        aria-label="Note tags"
      />
      <div className="flex gap-3 justify-end">
        {showCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 disabled:opacity-50 dark:text-gray-200"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitDisabled}
          aria-disabled={isSubmitDisabled}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-white ${
            isSubmitDisabled
              ? "bg-blue-300 cursor-not-allowed dark:bg-blue-400"
              : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          }`}
        >
          {isSaving ? (
            <>
              <Spinner />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
});
// NoteItem component
const NoteItem = React.memo(function NoteItem({
  note,
  onEdit,
  onDelete,
  activeTagFilter,
  onTagClick,
}) {
  return (
    <article className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow hover:shadow-lg transition relative flex flex-col">
      <h3
        className="font-semibold text-gray-800 dark:text-gray-100 mb-2 truncate"
        title={note.title}
      >
        {note.title || <em className="text-gray-400 dark:text-gray-400">No title</em>}
      </h3>
      <p className="mb-4 whitespace-pre-wrap text-gray-700 dark:text-gray-200 max-h-32 overflow-auto">
        {note.content}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {(note.tags || []).map((tag) => (
          <Tag
            key={tag}
            name={tag}
            onClick={() => onTagClick(tag)}
            isActive={activeTagFilter === tag}
          />
        ))}
      </div>
      <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
        <time dateTime={note.createdAt}>{formatDate(note.createdAt)}</time>
        <time dateTime={note.createdAt}>{formatTime(note.createdAt)}</time>
      </div>
      <div className="flex gap-3 mt-auto">
        <Button
          variant="warning"
          onClick={onEdit}
          aria-label={`Edit note titled ${note.title || "Untitled"}`}
        >
          <FaEdit />
          Edit
        </Button>
        <Button
          variant="danger"
          onClick={onDelete}
          aria-label={`Delete note titled ${note.title || "Untitled"}`}
        >
          <FaTrash />
          Delete
        </Button>
      </div>
    </article>
  );
});

// Main Notes component

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);


  // Floating form states
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteTags, setNewNoteTags] = useState("");

  // Edit note form floating modal
  const [editNoteId, setEditNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");

  const [toast, setToast] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTagFilter, setActiveTagFilter] = useState(null);
const [userToken, setUserToken] = useState("");

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotes();
      const notesArray = res.data?.data ?? [];
      notesArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotes(notesArray);
    } catch {
      showToast("Failed to fetch data.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
 
  const fetchToken = async () => {
    try {
      const res = await Token(); // Token() calls your endpoint
      const tokenValue = res.data?.token || localStorage.getItem("token"); 
      setUserToken(tokenValue);
    } catch (err) {
      console.error("Failed to fetch token:", err);
    }
  };

  fetchToken();
  }, [fetchNotes]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = async (e) => {
  e.preventDefault();
  if (!newNoteTitle.trim() && !newNoteContent.trim()) return;
  setSaving(true);
  try {
    // Split text into chunks if too long
    const chunks = chunkText(newNoteContent);

    for (let i = 0; i < chunks.length; i++) {
      const res = await createNote({
        title: `${newNoteTitle} (Part ${i + 1})`,
        content: chunks[i],
        tags: newNoteTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });

      setNotes((prev) => [res.data.data, ...prev]);
    }

    setNewNoteTitle("");
    setNewNoteContent("");
    setNewNoteTags("");
    setIsAddFormOpen(false);
    showToast(`Note added successfully! (${chunks.length} part(s))`, "success");
  } catch {
    showToast("Failed to create note.", "error");
  } finally {
    setSaving(false);
  }
};


  const openEditForm = (note) => {
    setEditNoteId(note._id);
    setEditTitle(note.title || "");
    setEditContent(note.content || "");
    setEditTags(note.tags ? note.tags.join(", ") : "");
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() && !editContent.trim()) return;
    setSaving(true);
    try {
      const res = await updateNote(editNoteId, {
        title: editTitle.trim(),
        content: editContent.trim(),
        tags: editTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      setNotes((prev) =>
        prev.map((note) => (note._id === editNoteId ? res.data.data : note))
      );
      setEditNoteId(null);
      showToast("Note updated successfully!", "success");
    } catch {
      showToast("Failed to update note.", "error");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (note) => {
    setNoteToDelete(note);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!noteToDelete) return;
    setSaving(true);
    try {
      await deleteNote(noteToDelete._id);
      setNotes((prev) => prev.filter((n) => n._id !== noteToDelete._id));
      showToast("Note deleted successfully!", "success");
    } catch {
      showToast("Failed to delete note.", "error");
    } finally {
      setSaving(false);
      setDeleteModalOpen(false);
      setNoteToDelete(null);
    }
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.tags || []).some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesTag = activeTagFilter
        ? note.tags?.includes(activeTagFilter)
        : true;
      return matchesSearch && matchesTag;
    });
  }, [notes, searchQuery, activeTagFilter]);

const visibleNotes = filteredNotes;

  const clearFilters = () => {
    setActiveTagFilter(null);
    setSearchQuery("");
  };
function chunkText(text, chunkSize = 35000, overlap = 100) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

  
// inside Notes component:
const handlePdfUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const text = await pdfToText(file);
    const fileName = file.name.replace(/\.pdf$/i, "");

    // Split into chunks
    const chunks = chunkText(text);

    // 👉 Instead of creating notes here, set content in form
    setNewNoteTitle(fileName);
    setNewNoteContent(chunks.join("\n\n---\n\n")); // show full text separated by markers
    setNewNoteTags("pdf-uploaded-content");

    // User will now see this text in Add form
  } catch (err) {
    console.error(err);
    showToast("Failed to extract text from PDF", "error");
  }
};


 return (
  <main className="max-w-5xl mx-auto p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100 relative">
    <h1 className="text-3xl font-semibold mb-6">My Content</h1>
      {/* Token display and copy button */}
      <h1>Here is the User's Token</h1>
<div className="mb-6 p-4 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-between gap-3">
  <span className="break-all text-sm text-gray-800 dark:text-gray-100">
    {userToken || "No token found"}
  </span>
  <button
    onClick={() => {
      navigator.clipboard.writeText(userToken);
      showToast("Token copied to clipboard!", "success");
    }}
    className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 text-sm"
  >
    Copy
  </button>
</div>

    {/* Search bar */}
    <div className="mb-6 flex items-center gap-3 max-w-md">
      <FaSearch className="text-gray-500 dark:text-gray-400" />
      <input
        type="search"
        aria-label="Search notes"
        placeholder="Search data by title, content, or tags..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
      />
      {(searchQuery || activeTagFilter) && (
        <Button variant="secondary" onClick={clearFilters}>
          Clear Filters
        </Button>
      )}
    </div>

  <div className="fixed bottom-10 right-10 flex flex-col gap-4 z-50">
  <button
    onClick={() => setIsAddFormOpen(true)}
    aria-label="Add new note"
    title="Add new note"
    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-400"
  >
    <FaPlus size={24} />
  </button>
</div>

{/* Floating Add Note form modal */}
   <FloatingModal
  isOpen={isAddFormOpen}
  onClose={() => !saving && setIsAddFormOpen(false)}
  title="Add New Note"
>
  {/* PDF Upload Button */}
  <div className="mb-4">
    <label
      htmlFor="pdf-upload"
      className="cursor-pointer px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
    >
      Upload PDF
    </label>
    <input
      id="pdf-upload"
      type="file"
      accept="application/pdf"
      className="hidden"
      onChange={handlePdfUpload}
    />
  </div>

  <NoteForm
    title={newNoteTitle}
    content={newNoteContent}
    tags={newNoteTags}
    onTitleChange={(e) => setNewNoteTitle(e.target.value)}
    onContentChange={(e) => setNewNoteContent(e.target.value)}
    onTagsChange={(e) => setNewNoteTags(e.target.value)}
    onSubmit={handleCreate}
    isSaving={saving}
    submitLabel="Add Note"
    showCancel={true}
    onCancel={() => !saving && setIsAddFormOpen(false)}
  />
</FloatingModal>


    {/* Floating Edit Note form modal */}
    <FloatingModal
      isOpen={!!editNoteId}
      onClose={() => !saving && setEditNoteId(null)}
      title="Edit Note"
    >
      <NoteForm
        title={editTitle}
        content={editContent}
        tags={editTags}
        onTitleChange={(e) => setEditTitle(e.target.value)}
        onContentChange={(e) => setEditContent(e.target.value)}
        onTagsChange={(e) => setEditTags(e.target.value)}
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveEdit();
        }}
        isSaving={saving}
        submitLabel="Save Changes"
        showCancel={true}
        onCancel={() => !saving && setEditNoteId(null)}
        ariaLabelPrefix="Edit note form"
      />
    </FloatingModal>

    {/* Notes list */}
    {loading ? (
      <p className="text-center text-gray-500 dark:text-gray-400">Loading content...</p>
    ) : filteredNotes.length === 0 ? (
      <p className="text-center text-gray-500 dark:text-gray-400">
        No content found. Add one above or adjust your filters!
      </p>
    ) : (
      <>
        <section className="grid gap-6 md:grid-cols-2">
          {visibleNotes.map((note) => (
            <NoteItem
              key={note._id}
              note={note}
              onEdit={() => openEditForm(note)}
              onDelete={() => confirmDelete(note)}
              activeTagFilter={activeTagFilter}
              onTagClick={(tag) =>
                setActiveTagFilter(tag === activeTagFilter ? null : tag)
              }
            />
          ))}
        </section>
      </>
    )}

    {/* Delete confirmation modal */}
    <Modal
      isOpen={deleteModalOpen}
      title="Confirm Delete"
      onClose={() => setDeleteModalOpen(false)}
      onConfirm={handleDelete}
      confirmLabel="Delete"
      cancelLabel="Cancel"
    >
      <p>
        Are you sure you want to delete the note titled "
        <strong>{noteToDelete?.title || "Untitled"}</strong>"? This action
        cannot be undone.
      </p>
    </Modal>

    {/* Toast notifications */}
    {toast && (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    )}
  </main>
);

};

export default Notes;
