# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js-based personal blog with markdown-based articles. The blog supports Japanese content and uses a file-based article management system.

## Common Commands

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run Next.js linter
- `npm run new:article` - Create new article with auto-generated slug

## Architecture

### Article System

- Articles are stored as markdown files in the `articles/` directory
- Each article has a unique 14-character hex slug as filename (e.g., `a64f7ab29eabdc.md`)
- Articles use gray-matter for frontmatter parsing with required fields: `title`, `createdAt`, `tags`
- Article utilities are centralized in `utils/article.ts`

### App Structure (Next.js 13+ App Router)

- `app/` contains the Next.js app router pages
- `components/` contains reusable React components
- Main layout with navigation is in `app/layout.tsx`
- Article rendering uses ReactMarkdown with syntax highlighting

### Styling

- Uses Tailwind CSS for styling
- Custom article markdown styles in `styles/article.module.css`
- Dark theme with custom colors (bg-my-black)

### Key Components

- `Markdown.tsx` - Handles markdown rendering with syntax highlighting and GFM support
- `Article.tsx` - Article display component
- `Tag.tsx` - Tag display component

### Article Management

- New articles created via `scripts/create-article.sh`
- Slug generation via `scripts/generate-slug.sh` (14-character hex)
- Articles automatically sorted by creation date (newest first)
- Tag system with counting and filtering support

### Configuration

- TypeScript with strict mode
- Tailwind configured for app/ and components/ directories
- Syntax highlighting using highlight.js with Material theme
- Google Analytics integration via custom component
