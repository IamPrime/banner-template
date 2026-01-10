#!/usr/bin/env python3
"""
Banner - MkDocs Material Portfolio & Blog Template Setup Script

This script helps you quickly customize the template with your personal information.
It will replace all template placeholders with your actual details.

Usage:
    python setup_template.py
"""

import os
import re
import shutil
from datetime import datetime
from pathlib import Path

class TemplateSetup:
    def __init__(self):
        self.base_path = Path(__file__).parent
        self.template_vars = {}
        self.files_to_process = [
            'mkdocs.yml',
            'docs/index.md',
            'docs/about.md',
            'docs/timeline.md',
            'docs/blog/.authors.yml'
        ]
        
    def welcome_message(self):
        print("🌟 Welcome to Banner Portfolio Template Setup!")
        print("=" * 60)
        print("This script will help you customize the template with your information.")
        print("You can skip any field by pressing Enter (you can edit manually later).")
        print("=" * 60)
        print()

    def collect_basic_info(self):
        """Collect basic personal information"""
        print("📝 BASIC INFORMATION")
        print("-" * 30)
        
        self.template_vars['YOUR_NAME'] = input("Your full name: ").strip()
        self.template_vars['YOUR_FIRST_NAME'] = input("Your first name: ").strip() or self.template_vars['YOUR_NAME'].split()[0]
        self.template_vars['SITE_NAME'] = input("Site name (e.g., 'John Doe Portfolio'): ").strip() or f"{self.template_vars['YOUR_NAME']} Portfolio"
        self.template_vars['SITE_URL'] = input("Site URL (e.g., 'https://yourdomain.com'): ").strip()
        self.template_vars['YOUR_EMAIL'] = input("Your email address: ").strip()
        self.template_vars['YOUR_LOCATION'] = input("Your location (e.g., 'San Francisco, CA'): ").strip()
        print()

    def collect_professional_info(self):
        """Collect professional information"""
        print("💼 PROFESSIONAL INFORMATION")
        print("-" * 30)
        
        self.template_vars['YOUR_PRIMARY_ROLE'] = input("Your primary role (e.g., 'Software Engineer'): ").strip()
        self.template_vars['YOUR_SECONDARY_ROLE'] = input("Your secondary role (e.g., 'Full-Stack Developer'): ").strip()
        self.template_vars['YOUR_PROFESSIONAL_TITLE'] = input("Professional title: ").strip() or self.template_vars['YOUR_PRIMARY_ROLE']
        self.template_vars['YOUR_CURRENT_COMPANY'] = input("Current company: ").strip()
        self.template_vars['YOUR_CURRENT_POSITION'] = input("Current position: ").strip() or self.template_vars['YOUR_PRIMARY_ROLE']
        self.template_vars['YOUR_YEARS_EXPERIENCE'] = input("Years of experience: ").strip() or "5"
        self.template_vars['YOUR_PROFESSIONAL_SUMMARY'] = input("Brief professional summary (1-2 sentences): ").strip()
        print()

    def collect_technical_info(self):
        """Collect technical skills information"""
        print("⚙️ TECHNICAL SKILLS")
        print("-" * 30)
        
        self.template_vars['YOUR_PROGRAMMING_LANGUAGES'] = input("Programming languages (e.g., 'Python, JavaScript, TypeScript'): ").strip()
        self.template_vars['YOUR_FRAMEWORKS'] = input("Frameworks (e.g., 'React, Django, FastAPI'): ").strip()
        self.template_vars['YOUR_DATABASES'] = input("Databases (e.g., 'PostgreSQL, MongoDB, Redis'): ").strip()
        self.template_vars['YOUR_CLOUD_SKILLS'] = input("Cloud & DevOps (e.g., 'AWS, Docker, Kubernetes'): ").strip()
        self.template_vars['YOUR_DEVELOPMENT_TOOLS'] = input("Development tools (e.g., 'Git, VS Code, Figma'): ").strip()
        print()

    def collect_social_links(self):
        """Collect social media and professional links"""
        print("🔗 SOCIAL LINKS")
        print("-" * 30)
        
        self.template_vars['LINKEDIN_URL'] = input("LinkedIn URL: ").strip()
        self.template_vars['GITHUB_URL'] = input("GitHub URL: ").strip()
        self.template_vars['TWITTER_URL'] = input("Twitter URL (optional): ").strip()
        self.template_vars['YOUR_WEBSITE_URL'] = input("Personal website URL (optional): ").strip()
        print()

    def collect_assets_info(self):
        """Collect information about assets and files"""
        print("🖼️ ASSETS & FILES")
        print("-" * 30)
        
        self.template_vars['YOUR_LOGO_PATH'] = input("Logo file path (relative to docs/, e.g., 'assets/professional/logo.jpg'): ").strip() or "assets/professional/logo.jpg"
        self.template_vars['YOUR_FAVICON_PATH'] = input("Favicon path (e.g., 'assets/favicon/favicon.ico'): ").strip() or "assets/favicon/favicon.ico"
        self.template_vars['YOUR_VIDEO_FILE'] = input("Profile video filename (optional, e.g., 'profile_video.mp4'): ").strip()
        self.template_vars['YOUR_IMAGE_FILE'] = input("Profile image filename (alternative to video, e.g., 'profile.jpg'): ").strip()
        print()

    def collect_content_preferences(self):
        """Collect content and interest information"""
        print("✨ CONTENT & INTERESTS")
        print("-" * 30)
        
        self.template_vars['YOUR_BLOG_TOPICS'] = input("Blog topics (e.g., 'web development, tech trends'): ").strip()
        self.template_vars['YOUR_DISCUSSION_TOPICS'] = input("What you like to discuss (e.g., 'technology, innovation'): ").strip()
        self.template_vars['YOUR_CODING_INTERESTS'] = input("Coding interests (e.g., 'Building web apps and APIs'): ").strip()
        self.template_vars['YOUR_HOBBIES'] = input("Main hobbies (e.g., 'Photography, hiking, gaming'): ").strip()
        print()

    def generate_additional_vars(self):
        """Generate additional template variables based on collected info"""
        current_year = datetime.now().year
        self.template_vars['CURRENT_YEAR'] = str(current_year)
        
        # Generate repository info
        if self.template_vars.get('GITHUB_URL'):
            github_user = self.template_vars['GITHUB_URL'].split('/')[-1]
            site_name_slug = self.template_vars.get('SITE_NAME', '').lower().replace(' ', '-')
            self.template_vars['REPO_URL'] = f"https://github.com/{github_user}/{site_name_slug}"
            self.template_vars['REPO_NAME'] = f"{github_user}/{site_name_slug}"
        
        # Generate author handle for blog
        if self.template_vars.get('YOUR_NAME'):
            name_parts = self.template_vars['YOUR_NAME'].lower().split()
            self.template_vars['YOUR_HANDLE'] = '_'.join(name_parts[:2])  # Use first two names
        
        # Generate site description
        role = self.template_vars.get('YOUR_PRIMARY_ROLE', 'Professional')
        name = self.template_vars.get('YOUR_NAME', 'Person')
        self.template_vars['SITE_DESCRIPTION'] = f"Personal portfolio and blog of {name}, {role}"
        
        # Set avatar path for blog
        self.template_vars['YOUR_AVATAR_PATH'] = self.template_vars.get('YOUR_IMAGE_FILE', 'assets/professional/avatar.jpg')
        
        # Set URL for blog authors (use personal website or LinkedIn)
        self.template_vars['YOUR_URL'] = self.template_vars.get('YOUR_WEBSITE_URL') or self.template_vars.get('LINKEDIN_URL', '')
        
        # Generate description for blog authors
        role = self.template_vars.get('YOUR_PROFESSIONAL_TITLE', 'Developer')
        company = self.template_vars.get('YOUR_CURRENT_COMPANY', '')
        company_text = f" Currently working at {company}." if company else ""
        interests = self.template_vars.get('YOUR_BLOG_TOPICS', 'technology')
        self.template_vars['YOUR_DESCRIPTION'] = f"{role} passionate about {interests}.{company_text}"

    def replace_template_vars(self, content):
        """Replace template variables in content"""
        for var, value in self.template_vars.items():
            if value:  # Only replace if value is not empty
                pattern = f"{{{{{var}}}}}"
                content = content.replace(pattern, str(value))
        return content

    def process_files(self):
        """Process all template files and create final versions"""
        print("🔄 Processing template files...")
        
        for file_path in self.files_to_process:
            template_path = self.base_path / file_path
            
            if not template_path.exists():
                print(f"⚠️  File not found: {file_path}")
                continue
            
            # Create backup of original file
            backup_path = template_path.with_suffix(template_path.suffix + '.backup')
            if not backup_path.exists():
                shutil.copy2(template_path, backup_path)
                print(f"📁 Created backup: {file_path}.backup")
                
            # Read template content
            with open(template_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace template variables
            processed_content = self.replace_template_vars(content)
            
            # Write processed content back to original file
            with open(template_path, 'w', encoding='utf-8') as f:
                f.write(processed_content)
            
            print(f"✅ Updated: {file_path}")

    def create_requirements_file(self):
        """Create requirements.txt if it doesn't exist"""
        req_file = self.base_path / 'requirements.txt'
        if req_file.exists():
            print("✅ requirements.txt already exists")
            return
            
        requirements = [
            "mkdocs>=1.5.0",
            "mkdocs-material>=9.4.0",
            "mkdocs-open-in-new-tab>=1.0.3",
            "neoteroi-mkdocs>=1.0.0",
            "pymdown-extensions>=10.3",
        ]
        
        with open(req_file, 'w') as f:
            f.write('\n'.join(requirements) + '\n')
        
        print("✅ Created: requirements.txt")

    def final_instructions(self):
        """Display final setup instructions"""
        print()
        print("🎉 SETUP COMPLETE!")
        print("=" * 60)
        print("✅ Your template files have been updated with your information.")
        print("📁 Original files backed up with .backup extension.")
        print()
        print("Next steps:")
        print()
        print("1. Install dependencies:")
        print("   pip install -r requirements.txt")
        print()
        print("2. Add your assets:")
        print("   - Place your logo/avatar in docs/assets/professional/")
        print("   - Add your favicon to docs/assets/favicon/")
        print("   - Update any remaining placeholders in the updated files")
        print()
        print("3. Start development server:")
        print("   mkdocs serve")
        print()
        print("4. Build your site:")
        print("   mkdocs build")
        print()
        print("5. Deploy to your preferred platform (Netlify, GitHub Pages, etc.)")
        print()
        print("💡 Tip: Check the updated files for any remaining {{PLACEHOLDER}} values")
        print("    that you may want to customize further.")
        print()
        print("🔄 To revert changes: restore from the .backup files")
        print("📚 For more help, see THEME_README.md")
        print("=" * 60)

    def run(self):
        """Run the complete setup process"""
        self.welcome_message()
        
        # Collect all information
        self.collect_basic_info()
        self.collect_professional_info()
        self.collect_technical_info()
        self.collect_social_links()
        self.collect_assets_info()
        self.collect_content_preferences()
        
        # Generate additional variables
        self.generate_additional_vars()
        
        # Process template files
        self.process_files()
        
        # Create requirements file
        self.create_requirements_file()
        
        # Show final instructions
        self.final_instructions()

if __name__ == "__main__":
    setup = TemplateSetup()
    setup.run()