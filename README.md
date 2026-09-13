# Image2PDF Pro

Image2PDF Pro is a React + Vite web app that converts multiple images into a single PDF. It supports drag-and-drop uploads, image reordering, rotation, preview, and download before export.

## Features

- Add multiple images at once
- Drag and drop upload area
- Reorder images before export
- Rotate images left or right
- Sort by file name or reverse order
- Preview images in a lightbox
- Adjust PDF settings
- Generate and preview the PDF before downloading
- Mobile-friendly layout with a settings drawer

## Tech Stack

- React 19
- Vite
- jsPDF
- canvas-confetti
- lucide-react

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Deployment

This project is configured for Vercel with `vercel.json`.

Deployment settings:

- Build command: `npm run build`
- Output directory: `dist`
- Framework preset: `Vite`

If you are deploying from GitHub, connect the repository to Vercel and deploy the `main` branch.

## Project Structure

```text
src/
  components/
  utils/
  App.jsx
  main.jsx
```

## Notes

- Generated PDFs are created in the browser.
- Image previews use object URLs and are cleaned up after use.
- If you change the app name or branding, update this README and the UI text together.
