import express from 'express'
import { engine } from 'express-handlebars'
import { nanoid } from 'nanoid'

import BOOKS_DATA from './data/data.js'

const app = express()
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index', {
    layout: 'main' ,
    title: 'My Reading List'
  })
})

app.get('/books', (req, res) => {
  res.render('list', {
    books: BOOKS_DATA
  })
})

app.post('/books', (req, res) => {
  const newBook = req.body
  newBook.id = nanoid()
  BOOKS_DATA.push(newBook)
  res.redirect(`/books/${ newBook.id  }`)
})

app.get('/books/:id', (req, res) => {
  const bookId = req.params.id
  const book = BOOKS_DATA.find(book => book.id === bookId)
  res.render('details', { book: book })
})

app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id
  const bookIndex = BOOKS_DATA.findIndex(book => book.id === bookId)
  BOOKS_DATA.splice(bookIndex, 1)
  res.send()
})

app.put('/books/:id', (req, res) => {
  const { id } = req.params
  const { title, author } = req.body
  const updatedBook = { id, title, author }
  const bookIndex = BOOKS_DATA.findIndex(book => book.id === id)
  BOOKS_DATA[bookIndex] = updatedBook
  res.render('details', { book: updatedBook })
})

app.get('/books/edit/:id', (req, res) => {
  const bookId = req.params.id
  const book = BOOKS_DATA.find(book => book.id === bookId)
  res.render('edit', { book: book })
})

app.post('/books/search', (req, res) => {
  const searchTerm = req.body.search.toLowerCase()
  const filteredBooks = BOOKS_DATA.filter(book => book.title.toLowerCase().includes(searchTerm) || book.author.toLowerCase().includes(searchTerm))
  res.render('list', { books: filteredBooks })
})

app.listen(3000, () => {
  console.log('App listening on port 3000')
})