Build a Complete Real Novel Library System

I have an existing novel-reading website built with React, Node.js/Express, and MongoDB.

Currently, the website has no real novels/books in the database.

Your task is to inspect my existing project and implement a complete, production-quality book/novel library system that can populate the platform with real books from legitimate sources.

⚠️ IMPORTANT CONTENT RULE

Do NOT scrape, copy, or redistribute copyrighted novels from arbitrary websites.

Use legitimate APIs and public-domain/openly licensed sources.

Prioritize:

1. Project Gutenberg/public-domain books for full-text reading
2. Open Library for book metadata
3. Google Books API for metadata, covers, previews, and links where appropriate

Where a book is not legally available for full-text redistribution, only store/display its metadata and link users to an authorized preview or reading source.

Do not invent fake novels just to populate the UI.

---

PHASE 1 — INSPECT THE EXISTING PROJECT

Before changing anything, inspect the entire project.

Determine:

- React version
- Node.js version
- Express setup
- MongoDB/Mongoose setup
- Existing folder structure
- Existing authentication
- Existing admin authentication/authorization
- Existing API structure
- Existing UI component system
- Existing routing
- Existing state management
- Existing styling system
- Existing user model
- Existing admin dashboard
- Existing deployment configuration

Do not unnecessarily rewrite existing code.

Reuse the architecture and components that already exist.

---

PHASE 2 — BOOK DATA ARCHITECTURE

Create or improve the Book model.

Use a structure similar to:

{
  title: String,

  subtitle: String,

  authors: [
    {
      name: String,
      id: String
    }
  ],

  description: String,

  coverImage: String,

  bannerImage: String,

  genres: [String],

  tags: [String],

  language: String,

  publishedDate: String,

  publisher: String,

  isbn10: String,

  isbn13: String,

  pageCount: Number,

  source: String,

  sourceId: String,

  sourceUrl: String,

  previewUrl: String,

  readingUrl: String,

  contentType: String,

  isPublicDomain: Boolean,

  isReadable: Boolean,

  isFeatured: Boolean,

  isPublished: Boolean,

  views: Number,

  rating: Number,

  ratingCount: Number,

  createdAt: Date,

  updatedAt: Date
}

Adjust the schema to fit my existing architecture.

Add appropriate indexes for:

- title
- author
- genres
- source
- sourceId

Prevent duplicate imports using a reliable source identifier.

---

PHASE 3 — EXTERNAL BOOK SOURCES

Create a clean service layer.

Example:

server/
├── services/
│   └── books/
│       ├── gutenberg.service.js
│       ├── openLibrary.service.js
│       ├── googleBooks.service.js
│       └── bookImport.service.js

Adapt this structure to my project.

The system should normalize results from different APIs into one internal Book format.

For example:

External API
     ↓
API-specific service
     ↓
Normalizer
     ↓
Book model
     ↓
MongoDB

Do not tightly couple the frontend to an external API.

---

PHASE 4 — PROJECT GUTENBERG

Implement a public-domain book integration.

The system should be able to retrieve legitimate public-domain books and their metadata.

Where the source permits full-text access:

- Store the appropriate reading URL/content reference
- Allow the user to read the book inside my website where legally permitted
- Do not violate the source's usage requirements

Support books in common formats where appropriate:

- HTML
- EPUB
- TXT

Do not blindly download thousands of books.

Implement controlled importing.

---

PHASE 5 — OPEN LIBRARY

Implement Open Library integration for metadata discovery.

The admin should be able to search:

Harry Potter
Romance
African Literature
Fantasy
Mystery
Science Fiction
Classic Literature

Display:

- Cover
- Title
- Author
- Publication information
- Description where available
- ISBN
- Source
- Availability/reading information

Allo