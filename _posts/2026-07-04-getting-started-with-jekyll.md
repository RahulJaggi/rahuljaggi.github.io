---
layout: post
title: "Getting Started with Jekyll and GitHub Pages"
date: 2026-07-04 08:00:00 +0530
tags: [Jekyll, GitHub Pages, Web Development]
excerpt: "A comprehensive guide to setting up your own portfolio or blog using Jekyll and GitHub Pages — completely free and with custom domain support."
---

Jekyll is a powerful static site generator that pairs perfectly with GitHub Pages for hosting your portfolio or blog — completely free. In this post, I'll walk you through everything you need to know to get started.

## Why Jekyll + GitHub Pages?

- **Free hosting** — GitHub Pages is completely free for public repositories
- **Fast** — static HTML is lightning fast with no server-side rendering
- **Version controlled** — your entire site lives in Git
- **Custom domains** — point your own domain for free
- **Markdown support** — write posts in simple Markdown

## Prerequisites

Before we begin, make sure you have:

1. Ruby >= 2.5 installed (Ruby 3.x recommended)
2. Bundler gem installed
3. A GitHub account

## Setting Up Jekyll

First, install Jekyll and Bundler:

```bash
gem install jekyll bundler
```

Create a new site:

```bash
jekyll new my-portfolio
cd my-portfolio
```

Start the local server:

```bash
bundle exec jekyll serve
```

Visit `http://localhost:4000` to see your site live!

## Project Structure

A typical Jekyll project looks like this:

```
my-portfolio/
├── _config.yml        # Site configuration
├── _layouts/          # HTML templates
├── _includes/         # Reusable HTML snippets
├── _posts/            # Blog posts (Markdown)
├── _sass/             # SCSS stylesheets
├── assets/            # CSS, JS, images
└── index.html         # Homepage
```

## Deploying to GitHub Pages

1. Create a repository named `username.github.io`
2. Push your Jekyll site to the `main` branch
3. In repository settings → Pages → select "GitHub Actions" as source
4. Add a workflow file at `.github/workflows/jekyll.yml`

Your site will be live at `https://username.github.io` within minutes!

## Conclusion

Jekyll and GitHub Pages is one of the best combinations for hosting a personal portfolio or blog. It's fast, free, and incredibly flexible. Give it a try!

Feel free to explore the [source code](https://github.com/rahuljaggi/rahuljaggi.github.io) of this site as a reference.
