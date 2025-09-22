#!/usr/bin/env node

/**
 * Create Placeholder Images Script
 * 
 * This script creates placeholder images for the website using simple colored rectangles
 * with text overlays to represent different categories of content.
 */

const fs = require('fs')
const path = require('path')

// Create a simple SVG placeholder image
function createPlaceholderSVG(width, height, text, backgroundColor = '#e5e7eb', textColor = '#374151') {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${backgroundColor}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" font-weight="bold" 
          text-anchor="middle" dominant-baseline="middle" fill="${textColor}">${text}</text>
  </svg>`
}

// Define the images we need to create
const imagesToCreate = [
  // Hero images
  { name: 'hero-education.jpg', width: 800, height: 600, text: 'Education Hero', color: '#3b82f6' },
  { name: 'hero-environment.jpg', width: 800, height: 600, text: 'Environment Hero', color: '#10b981' },
  { name: 'hero-healthcare.jpg', width: 800, height: 600, text: 'Healthcare Hero', color: '#ef4444' },
  
  // Project images
  { name: 'education-project.jpg', width: 600, height: 400, text: 'Education Project', color: '#3b82f6' },
  { name: 'environment-project.jpg', width: 600, height: 400, text: 'Environment Project', color: '#10b981' },
  { name: 'healthcare-project.jpg', width: 600, height: 400, text: 'Healthcare Project', color: '#ef4444' },
  { name: 'water-project.jpg', width: 600, height: 400, text: 'Water Project', color: '#06b6d4' },
  
  // Blog images
  { name: 'blog-water.jpg', width: 400, height: 300, text: 'Water Blog', color: '#06b6d4' },
  { name: 'blog-volunteer.jpg', width: 400, height: 300, text: 'Volunteer Story', color: '#8b5cf6' },
  { name: 'blog-education.jpg', width: 400, height: 300, text: 'Education Blog', color: '#3b82f6' },
  { name: 'blog-healthcare.jpg', width: 400, height: 300, text: 'Healthcare Blog', color: '#ef4444' },
  { name: 'blog-agriculture.jpg', width: 400, height: 300, text: 'Agriculture Blog', color: '#84cc16' },
  { name: 'blog-impact.jpg', width: 400, height: 300, text: 'Impact Report', color: '#f59e0b' },
  
  // Marketing materials
  { name: 'poster-education.jpg', width: 300, height: 400, text: 'Education Poster', color: '#3b82f6' },
  { name: 'banner-web.jpg', width: 600, height: 200, text: 'Web Banner', color: '#ef4444' },
  { name: 'brochure-institutional.jpg', width: 400, height: 300, text: 'Brochure', color: '#10b981' },
  { name: 'video-promo.jpg', width: 500, height: 300, text: 'Video Thumbnail', color: '#8b5cf6' },
]

// Create the images directory if it doesn't exist
const imagesDir = path.join(process.cwd(), 'public', 'images')
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
}

// Create OG images directory
const ogDir = path.join(imagesDir, 'og')
if (!fs.existsSync(ogDir)) {
  fs.mkdirSync(ogDir, { recursive: true })
}

console.log('🖼️  Creating placeholder images...\n')

// Create each placeholder image
imagesToCreate.forEach(({ name, width, height, text, color }) => {
  const svg = createPlaceholderSVG(width, height, text, color, '#ffffff')
  const filePath = path.join(imagesDir, name)
  
  // Convert to PNG filename but save as SVG for now (browsers will handle it)
  const svgPath = filePath.replace('.jpg', '.svg')
  
  fs.writeFileSync(svgPath, svg)
  console.log(`✅ Created ${name} (as SVG)`)
})

// Create OG images for different languages
const languages = ['en', 'fr', 'es', 'de', 'it', 'pt', 'ar', 'zh']
languages.forEach(lang => {
  const svg = createPlaceholderSVG(1200, 630, `BAOBAB HOPE - ${lang.toUpperCase()}`, '#ef4444', '#ffffff')
  const filePath = path.join(ogDir, `default-${lang}.png`)
  const svgPath = filePath.replace('.png', '.svg')
  
  fs.writeFileSync(svgPath, svg)
  console.log(`✅ Created OG image for ${lang}`)
})

// Create a logo placeholder
const logoSvg = createPlaceholderSVG(200, 200, 'LOGO', '#ef4444', '#ffffff')
fs.writeFileSync(path.join(process.cwd(), 'public', 'logo.svg'), logoSvg)
console.log('✅ Created logo.svg')

// Create favicon
const faviconSvg = createPlaceholderSVG(32, 32, '♥', '#ef4444', '#ffffff')
fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon.svg'), faviconSvg)
console.log('✅ Created favicon.svg')

console.log('\n🎉 All placeholder images created successfully!')
console.log('\n📝 Note: These are SVG placeholders. For production, replace with actual images.')