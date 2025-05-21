const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Show all notes
router.get('/', async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.render('index', { notes });
});

// Form to create new note
router.get('/new', (req, res) => {
  res.render('new');
});

// Create new note
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  await Note.create({ title, content });
  res.redirect('/notes');
});

// View single note
router.get('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.render('note', { note });
});

// Delete note
router.post('/:id/delete', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.redirect('/notes');
});

// Show form to edit a note
router.get('/:id/edit', async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.render('edit', { note });
});

// Update the note
router.post('/:id', async (req, res) => {
  const { title, content } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, content });
  res.redirect(`/notes/${req.params.id}`);
});


module.exports = router;
