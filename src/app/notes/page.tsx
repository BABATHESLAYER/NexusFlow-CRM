"use client";

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircleIcon, Edit2Icon, Trash2Icon, PinIcon, SearchIcon } from 'lucide-react';
import { format } from 'date-fns';

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isPinned?: boolean;
};

const mockNotes: Note[] = [
  { id: '1', title: 'Meeting Prep for Acme Corp', content: 'Review Q3 proposal. Prepare slides on new features. Discuss pricing options.', createdAt: new Date(2023, 9, 10), updatedAt: new Date(2023, 9, 11), isPinned: true },
  { id: '2', title: 'Ideas for New Blog Post', content: '1. Top 5 CRM trends for 2024. 2. How AI is changing customer service. 3. Maximizing sales with lead nurturing.', createdAt: new Date(2023, 9, 5), updatedAt: new Date(2023, 9, 5) },
  { id: '3', title: 'Follow-up Reminders', content: '- Call John Doe re: contract renewal.\n- Email Sarah P. about demo feedback.', createdAt: new Date(2023, 9, 1), updatedAt: new Date(2023, 9, 1) },
];


export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleAddNote = () => {
    if (!newNoteTitle.trim()) return; // Basic validation
    const newNote: Note = {
      id: Date.now().toString(),
      title: newNoteTitle,
      content: newNoteContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes(prev => [newNote, ...prev]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setShowAddNoteForm(false);
  };

  const handleUpdateNote = () => {
    if (!editingNote || !editingNote.title.trim()) return;
    setNotes(prev => prev.map(n => n.id === editingNote.id ? { ...editingNote, updatedAt: new Date() } : n));
    setEditingNote(null);
  }

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const togglePinNote = (id: string) => {
    setNotes(prev => prev.map(note => note.id === id ? { ...note, isPinned: !note.isPinned } : note)
                       .sort((a,b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || b.updatedAt.getTime() - a.updatedAt.getTime() ));
  };
  
  const filteredNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a,b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || b.updatedAt.getTime() - a.updatedAt.getTime() );

  if (editingNote) {
    return (
      <AppLayout>
        <PageTitle title="Edit Note" description="Modify your existing note." />
        <Card className="shadow-lg">
          <CardHeader>
            <Input 
              value={editingNote.title}
              onChange={(e) => setEditingNote({...editingNote, title: e.target.value})}
              placeholder="Note Title"
              className="text-lg font-semibold"
            />
          </CardHeader>
          <CardContent>
            <Textarea 
              value={editingNote.content}
              onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
              placeholder="Note content..."
              rows={10}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingNote(null)}>Cancel</Button>
            <Button onClick={handleUpdateNote}>Save Changes</Button>
          </CardFooter>
        </Card>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <PageTitle title="My Notes" description="Keep track of your thoughts, ideas, and reminders." />
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowAddNoteForm(true)}>
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Note
          </Button>
        </div>
      </div>

      {showAddNoteForm && (
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Add New Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              placeholder="Note Title"
            />
            <Textarea 
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Note content..."
              rows={5}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddNoteForm(false)}>Cancel</Button>
            <Button onClick={handleAddNote}>Save Note</Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredNotes.map((note) => (
          <Card key={note.id} className={`shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col ${note.isPinned ? 'border-primary border-2' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="font-headline text-lg line-clamp-2">{note.title}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => togglePinNote(note.id)} className={note.isPinned ? 'text-primary' : ''}>
                  <PinIcon className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Last updated: {format(note.updatedAt, "MMM dd, yyyy 'at' p")}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-4">{note.content}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingNote(note)}>
                <Edit2Icon className="mr-1 h-3 w-3" /> Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteNote(note.id)}>
                <Trash2Icon className="mr-1 h-3 w-3" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredNotes.length === 0 && !showAddNoteForm && (
        <Card className="mt-6">
          <CardContent className="py-10 text-center">
            <StickyNoteIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No notes found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm ? "Try a different search term or " : "Get started by " }
              <Button variant="link" className="p-0 h-auto" onClick={() => {setShowAddNoteForm(true); setSearchTerm('');}}>adding a new note.</Button>
            </p>
          </CardContent>
        </Card>
      )}
    </AppLayout>
  );
}
