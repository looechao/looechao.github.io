# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `hugo` - Builds the site locally
- Production build: `HUGO_ENV=production hugo` - Builds with production settings
- Serve locally: `hugo server` - Serves the site locally with live reload
- Deploy: `./deploy.sh` - Builds and deploys to GitHub Pages (requires commit message)

## Content Guidelines
- Content files are Markdown located in `content/post/YYYY/`
- Front matter should include title, date, and tags
- Images should be placed in `static/assets/YYYY/`
- Use relative links for internal references
- For code blocks, use proper language syntax highlighting

## Style Guidelines
- Commit messages should be concise and descriptive
- Keep markdown formatting consistent
- Use proper headings hierarchy (H1 for title, H2 for sections)
- For math content, use `$...$` for inline and `$$...$$` for block equations
- Follow existing content organization patterns