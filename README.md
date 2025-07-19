# ML Club Blogs

A modern blog platform built with **SvelteKit**, **Tailwind CSS**, **TypeScript**, and **Supabase**.

---

## 🚀 Local Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/mlclub-blogs.git
   cd mlclub-blogs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the project root (do NOT commit this file).
   - Add your Supabase credentials:
     ```env
     VITE_SUPABASE_URL=your-supabase-url
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   - Visit [http://localhost:5173/](http://localhost:5173/) in your browser.

---

## 📝 Features Implemented

- **SvelteKit + Tailwind + TypeScript**: Modern frontend stack.
- **Supabase Integration**: Auth, database, and SSR session handling.
- **Authentication**: Login page, protected routes, session-aware UI.
- **Blog CRUD**:
  - Create, edit, and delete blogs (with confirmation dialogs).
  - Blogs have fields: `id`, `title`, `content`, `created_at`, `author_id`, `status`.
- **Blog Listing**:
  - Home page and `/blogs` page show all blogs in a responsive card layout.
  - Single blog view with details.
- **Dashboard**:
  - `/dashboard/blogs` for managing your own blogs (edit/delete).
- **Supabase RLS**: Project is ready for public or authenticated read policies.
- **Environment Variables**: Uses `.env` for Supabase keys (never commit real secrets).

---

## 📦 Project Structure

- `src/routes/` — SvelteKit routes (pages, server logic)
- `src/lib/` — Supabase client and shared code
- `.env.example` — Example environment file (add your real keys in `.env`)

---

## 🛠️ To Do / Next Steps
- Add more blog fields (category, tags, cover image, etc.)
- Improve UI/UX and accessibility
- Add user registration and profile pages
- Deploy to production

---

## 👥 Contributing
- Clone, create a branch, and open a pull request!
- Make sure to add your own `.env` file with Supabase credentials.

---

## 📄 License
MIT
