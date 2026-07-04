# rahuljaggi.github.io

Personal portfolio and blog built with Jekyll, hosted on GitHub Pages.

🌐 **Live Site**: [rahuljaggi.github.io](https://rahuljaggi.github.io)

## 🚀 Local Development

### Prerequisites
- Ruby 3.x (install via Homebrew: `brew install ruby`)
- Bundler (comes with Ruby or install with `gem install bundler`)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/rahuljaggi/rahuljaggi.github.io.git
cd rahuljaggi.github.io

# 2. Add Homebrew Ruby to PATH (add to ~/.zshrc for persistence)
export PATH="/opt/homebrew/opt/ruby/bin:/opt/homebrew/lib/ruby/gems/4.0.0/bin:$PATH"

# 3. Install dependencies
bundle install

# 4. Serve locally
bundle exec jekyll serve

# 5. Visit http://localhost:4000
```

### Live Reload
```bash
bundle exec jekyll serve --livereload
```

## 📁 Project Structure

```
.
├── _config.yml           # Site configuration
├── _data/
│   ├── projects.yml      # ✏️ Edit your projects here
│   └── skills.yml        # ✏️ Edit your skills here
├── _includes/
│   ├── head.html         # HTML <head> with SEO
│   ├── nav.html          # Navigation bar
│   ├── footer.html       # Footer
│   └── social-links.html # Social icons
├── _layouts/
│   ├── default.html      # Base layout
│   └── post.html         # Blog post layout
├── _posts/               # ✏️ Add blog posts here (YYYY-MM-DD-title.md)
├── _sass/                # SCSS source files
│   ├── _variables.scss   # Design tokens / CSS variables
│   ├── _components.scss  # Reusable components
│   └── ...
├── assets/
│   ├── css/main.scss     # Main stylesheet entry point
│   └── js/main.js        # JavaScript
├── .github/
│   └── workflows/
│       └── jekyll-deploy.yml  # Auto-deployment workflow
├── index.html            # Homepage
└── 404.html              # Custom 404 page
```

## ✏️ Customization

### Update Personal Info
Edit `_config.yml`:
- `title`, `tagline`, `description`
- `author.name`, `author.email`, `author.github`, etc.

### Add Projects
Edit `_data/projects.yml` — add a new entry:
```yaml
- title: "My New Project"
  icon: "🚀"
  description: "What this project does."
  tech: [React, Node.js]
  github: "https://github.com/rahuljaggi/project"
  live: "https://myproject.com"
```

### Add Skills
Edit `_data/skills.yml` — add to existing categories or create new ones.

### Write Blog Posts
Create a file in `_posts/` named `YYYY-MM-DD-post-title.md`:
```markdown
---
layout: post
title: "My Blog Post"
date: 2026-01-01 12:00:00 +0530
tags: [Tag1, Tag2]
---

Your content here...
```

### Change Theme Colors
Edit `_sass/_variables.scss` — change `--color-primary`, `--color-secondary`, etc.

## 🚢 Deployment

Deployment is automatic via GitHub Actions. Every push to `main` triggers:
1. Jekyll build with Ruby 3.3
2. Deploy to GitHub Pages

### First-time GitHub Pages Setup
1. Go to your repo → **Settings** → **Pages**
2. Under **Build and deployment**, select **GitHub Actions** as source
3. Push to `main` — your site deploys automatically!

## 📬 Contact Form
The contact form uses [Formspree](https://formspree.io). To activate it:
1. Sign up at formspree.io
2. Create a form and get your form ID
3. Replace `your-form-id` in `index.html` with your actual ID

## 📄 License
MIT License — feel free to use this as a template for your own portfolio!
