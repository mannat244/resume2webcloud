# [Resume2Web](https://resume2webcloud.vercel.app) – Convert Your Resume to a Stunning Website

## 📝 Introduction
**Resume2Web** is a powerful open-source tool that helps users convert their resumes into elegant, responsive personal websites. Whether you're a developer, designer, or job seeker, you can now showcase your experience and skills online—automatically and beautifully.

Now with **Cloudinary integration** and **live deployment on Vercel**!

## 🚀 What's New?
- ✅ **Cloudinary Integration** – We’ve replaced local file handling with **Cloudinary**, making the app fully compatible with **serverless platforms like Vercel**.
- ✅ **Deployed Live** – Visit the live app at: [https://resume2webcloud.vercel.app](https://resume2webcloud.vercel.app)

## 💡 Why We Built Resume2Web
Creating a personal portfolio website is usually a time-consuming task, requiring:
- Technical knowledge
- Hosting setup
- UI/UX design skills

**Resume2Web** solves all of this:
- 📄 Upload your resume (PDF)
- 🧠 We extract and structure your info using **Gemini AI**
- 🎨 Choose from stunning templates
- 🌐 Get a downloadable, SEO-friendly, static website

## ⚙️ Tech Stack
- **Next.js** – React framework with App Router and API handling
- **Tailwind CSS** – Utility-first CSS for styling
- **Cloudinary** – Cloud-based file storage for resume uploads
- **Google Gemini AI** – Parses and refines your resume content
- **NextAuth.js** – Google login for a seamless experience

## 📦 API Endpoints

### `/api/upload`
- Uploads PDF to **Cloudinary**
- Returns a secure URL for further processing

### `/api/extract`
- Extracts and structures resume content via **Gemini AI**
- Returns JSON with name, skills, education, experience, etc.

### `/api/render`
- Dynamically fills a selected template with extracted data
- Returns downloadable static HTML website

## 🌐 Live Deployment

The project is deployed on **Vercel** and now fully functional thanks to Cloudinary.

👉 Visit the deployed version here: [https://resume2webcloud.vercel.app](https://resume2webcloud.vercel.app)

## 🛠️ Running Locally

### 1. Clone the repo:
```bash
git clone https://github.com/your-username/resume2web.git
cd resume2web
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Create `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GEMINI_API=your_google_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Start the dev server:
```bash
npm run dev
```

### 5. Open in browser:
[http://localhost:3000](http://localhost:3000)

## 🤝 Contribution
Got a new template idea or want to help improve parsing logic? Feel free to fork, enhance, and raise a pull request!

## 📬 Contact
For bugs, questions, or feature suggestions, feel free to reach out or open an issue on GitHub.
