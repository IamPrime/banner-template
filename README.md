# 🌟 Banner - MkDocs Material Portfolio & Blog Template

A comprehensive template structure for the Banner project with advanced weather/seasonal themes, blog functionality, interactive timeline, and modern design patterns.

## 🎯 Features

### 🎨 Advanced Theme System
- **Hybrid Weather/Seasonal Themes**: Dynamic themes based on real-time weather data or calendar seasons
- **User Toggle Control**: Allow visitors to enable/disable seasonal effects
- **Visual Effects**: Animated snowflakes, rain, falling leaves, and spring petals
- **Smart Fallbacks**: Weather-first approach with calendar-based fallback
- **Material Design Preservation**: Maintains all original Material theme colors and layouts

### 🏗️ Portfolio & Blog Features
- **Modern Portfolio Layout**: Professional presentation of skills and experience
- **Integrated Blog**: Full-featured blogging with Material theme integration
- **Interactive Timeline**: Visual timeline for career progression and milestones
- **Responsive Design**: Optimized for all device sizes
- **SEO Optimized**: Built-in SEO features and social media integration

### 🛠️ Developer Experience
- **Easy Customization**: Template placeholders for quick setup
- **Modern Build System**: Netlify deployment ready
- **Analytics Ready**: Google Analytics integration
- **Privacy Compliant**: Cookie consent management
- **Offline Support**: Works offline with service worker

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip (Python package installer)

### 1. Clone & Setup
```bash
# Clone the template repository
git clone https://github.com/IamPrime/banner-template
cd <your-site-name>

# Install dependencies
pip install -r requirements.txt
```

### 2. Quick Configuration (Option A: Use Setup Script)
```bash
# Run the interactive setup script
python setup_template.py
```

### 3. Manual Configuration (Option B: Manual Setup)

#### Update `mkdocs.yml`
Replace template placeholders with your information:
- `{{SITE_NAME}}` → Your site name
- `{{SITE_URL}}` → Your site URL
- `{{YOUR_NAME}}` → Your full name
- `{{YOUR_LOGO_PATH}}` → Path to your logo image
- `{{YOUR_FAVICON_PATH}}` → Path to your favicon
- `{{LINKEDIN_URL}}` → Your LinkedIn profile URL
- `{{GITHUB_URL}}` → Your GitHub profile URL

#### Update Content Files
Edit the following files in the `docs/` directory:
- `index.md` - Homepage content
- `about.md` - About page
- `timeline.md` - Professional timeline
- `blog/.authors.yml` - Blog authors information

#### Add Your Assets
Replace placeholder assets in `docs/assets/`:
- `professional/` - Professional photos and videos
- `favicon/` - Favicon files

### 4. Development
```bash
# Start development server
mkdocs serve

# Open in browser: http://127.0.0.1:8000
```

### 5. Build & Deploy
```bash
# Build static site
mkdocs build

# Deploy to Netlify (if configured)
# Push to your connected Git repository
```

## 📁 Template Structure

```
your-site/
├── docs/                          # Content directory
│   ├── index.md                  # Homepage (customize this!)
│   ├── about.md                  # About page
│   ├── timeline.md               # Professional timeline
│   ├── assets/
│   │   ├── professional/         # Your professional photos
│   │   └── favicon/              # Favicon files
│   ├── blog/
│   │   ├── .authors.yml          # Blog authors info
│   │   ├── index.md              # Blog homepage
│   │   └── posts/                # Blog posts
│   ├── overrides/                # Custom theme files
│   │   ├── main.html            # Main template override
│   │   ├── theme-manager.js      # Weather/seasonal theme system
│   │   └── back-to-top.js       # Back to top functionality
│   └── stylesheets/              # Custom styles
├── mkdocs.yml                    # Main configuration (customize this!)
├── netlify.toml                  # Netlify deployment config
├── requirements.txt              # Python dependencies
├── setup_template.py             # Quick setup script
└── README.md                     # This file
```

## 🎨 Customizing the Weather/Seasonal Theme System

The template includes an advanced theme system that adapts to weather and seasons. Here's how to customize it:

### Theme Configuration
The theme system is controlled via JavaScript in `docs/overrides/theme-manager.js`. Key features:

- **User Toggle**: Users can enable/disable seasonal effects via a button in the header
- **Weather Integration**: Uses Open-Meteo API for real-time weather data
- **Seasonal Fallback**: Calendar-based themes when weather data is unavailable
- **Visual Effects**: Animated elements for different weather/seasons

### Customizing Effects
Edit `docs/stylesheets/theme-styles.css` to modify:
- Animation speeds and styles
- Color schemes for different seasons
- Visual effect intensities
- Mobile optimizations

### Disabling Theme System
To disable the weather/seasonal themes entirely:
1. Remove `theme-manager.js` from `extra_javascript` in `mkdocs.yml`
2. Remove theme-related CSS imports
3. Remove the toggle button from `docs/overrides/main.html`

## 📝 Content Customization Guide

### Homepage (`docs/index.md`)
Replace the template content with:
- Your professional introduction
- Skills and expertise
- Personal interests and hobbies
- Call-to-action sections

### About Page (`docs/about.md`)
Customize with:
- Detailed professional background
- Education and certifications
- Career highlights
- Personal philosophy

### Timeline (`docs/timeline.md`)
Add your professional milestones using the timeline syntax:
```markdown
:::timeline

    :::item{date='2026' title='Current Position'}
    Description of your current role and achievements.
    :::

    :::item{date='2025' title='Previous Role'}
    Description of previous position.
    :::

:::
```

### Blog Setup
1. Edit `docs/blog/.authors.yml` with your information
2. Create blog posts in `docs/blog/posts/`
3. Use frontmatter for post metadata:
```yaml
---
date: 2026-01-01
authors: [your-handle]
categories: [Technology, Web Development]
---
```

## 🚀 Deployment Options

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Use the included `netlify.toml` configuration
3. Set build command: `mkdocs build`
4. Set publish directory: `site/`

### GitHub Pages
```yaml
# Add to .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: 3.x
      - run: pip install -r requirements.txt
      - run: mkdocs gh-deploy --force
```

### Other Platforms
The template works with any static site hosting:
- Vercel
- Firebase Hosting
- AWS S3 + CloudFront
- DigitalOcean App Platform

## 🔧 Advanced Customization

### Adding New Plugins
Add to `mkdocs.yml`:
```yaml
plugins:
  - search
  - your-new-plugin
```

### Custom CSS
Add custom styles to `docs/stylesheets/extra.css`

### Custom JavaScript
Add scripts to `docs/overrides/` and reference in `mkdocs.yml`

### Navigation Customization
Modify the `nav` section in `mkdocs.yml` to reorganize your site structure.

## 🎯 SEO & Analytics

### Google Analytics
Update `mkdocs.yml` with your tracking ID:
```yaml
extra:
  analytics:
    provider: google
    property: G-XXXXXXXXXX
```

### Social Media
Configure social links in `mkdocs.yml`:
```yaml
extra:
  social:
    - icon: fontawesome/brands/linkedin
      link: https://linkedin.com/in/yourprofile
    - icon: fontawesome/brands/github
      link: https://github.com/yourusername
```

## 🆘 Support & Troubleshooting

### Common Issues

1. **Weather API not working**: Check browser console for CORS errors. The system gracefully falls back to seasonal themes.

2. **Build failures**: Ensure all dependencies are installed with `pip install -r requirements.txt`

3. **CSS not loading**: Check that all referenced files exist in the correct paths.

### Getting Help
- Check the detailed [Theme Documentation](THEME_README.md)
- Review [MkDocs Material documentation](https://squidfunk.github.io/mkdocs-material/)
- Open an issue in the template repository

## 📄 License

This template is licensed under MIT License. See LICENSE file for details.

## 🙏 Acknowledgments

- Built with [MkDocs](https://www.mkdocs.org/) and [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- Weather data from [Open-Meteo API](https://open-meteo.com/)
- Icons from [FontAwesome](https://fontawesome.com/)
- Designed by [IamPrime](https://www.github.com/IamPrime)

---

**Happy building! 🚀**

*This template provides a solid foundation for your portfolio and blog. Customize it to match your style and showcase your unique story.*