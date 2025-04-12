"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRef, useState } from "react";

export default function Dashboard() {

  const [logout, setlogout] = useState(false)
  const { data: session, status } = useSession();
  const [file, setfile] = useState()
  const [message, setmessage] = useState("")
  const [template, settemplate] = useState(1)
  const timestamp = Date.now();
  const buttonRef = useRef(null);


  const downloadFile = (html) => {
    // Create a Blob from the HTML string
    const blob = new Blob([html], { type: "text/html" });
    const downloadUrl = URL.createObjectURL(blob);
    
    // Create and click a temporary download link
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "index.html"; // Desired filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const alltemplates = [ 
    {
      id: 1,
      title: "Modern Animated Portfolio",
      desc: "A sleek, modern portfolio with smooth animations.",
      img: "/demo_temp1.png",
    },
    {
      id: 2,
      title: "Dark Glow Modern Portfolio",
      desc: "A bold dark theme with neon glow effects.",
      img: "/demo_temp2.png",
    },
    {
      id: 3,
      title: "Minimalist Clean Portfolio",
      desc: "A simple and elegant design with soft gradients.",
      img: "/demo_temp3.png",
    },
    {
      id: 4,
      title: "Netflix-Inspired Portfolio",
      desc: "A cinematic dark theme with a bold interface.",
      img: "/demo_temp4.png",
    },
    {
      id: 5,
      title: "Futuristic Neon Tech Portfolio",
      desc: "A sleek, blue-cyan design with a futuristic tech vibe.",
      img: "/demo_temp5.png",
    },
    {
      id:6,
      title:"Fashion-Designer Portfolio",
      desc:"A stylish and elegant portfolio for fashion designers.",
      img:"/demo_temp6.png",
    }
  ];
  
  
  const Designs = ({func, title, img, desc }) => {


    return (
      <div className={ `flex flex-col gap-2 flex-wrap items-center h-fit rounded-md p-1.5  peer-checked:border-zinc-700 peer-checked:p-1 peer-checked:border-[1px] peer-checked:bg-zinc-800/40`} onClick={func}>
      <img src={img} className="h-[250px] rounded-md  "></img>
      <p className="text-white font-bold text-center">{title}</p>
      <p className="text-zinc-300 max-w-80 text-center">{desc}</p>
      </div>
    )
  }
  

  if (status === "loading") return <div className="h-[100vh] flex items-center justify-center  w-[100vw] bg-zinc-900">
    <p className="font-semibold mx-auto text-zinc-500 my-auto">Loading...</p>;
  </div>
   

  const handleFile = (e)=>{
    if(e.target.files && e.target.files[0])
      setfile(e.target.files[0])
  }

  const handleTemplateChange = (e) => {
    settemplate(parseInt(e.target.value)); 
  };

  const previewWithDownload = (url) => {
    fetch(url)
      .then(response => response.text())
      .then(html => {
        const blob = new Blob([html], { type: "text/html" });
        const blobUrl = URL.createObjectURL(blob);
  
        const htmlPreview = `
          <html>
            <head>
              <title>Portfolio Preview</title>
              <style>
              ::-webkit-scrollbar {
    display: none;
}
                body { margin: 0; font-family: sans-serif; }
                .download-bar {
                  padding: 10px;
                  background: rgb(24 24 27);;
                  color: #fff;
                  text-align: center;
                }
                .download-bar a {
                  color: #fff;
                  text-decoration: none;
                  font-weight: bold;
                }
                iframe {
                  width: 100%;
                  height: calc(100vh - 40px);
                  border: none;
                }
              </style>
            </head>
            <body>
              <div class="download-bar">
                <a href="${url}" download="portfolio.html">Click Here To Download Your Stunning portfolio</a>
              </div>
              <iframe src="${blobUrl}"></iframe>
            </body>
          </html>
        `;
  
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(htmlPreview);
          newTab.document.close();
        } else {
          alert("Please enable popups for this site to see the preview.");
        }
      });
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    if (buttonRef.current) {
      buttonRef.current.disabled = true;
    }
    console.log(timestamp);
    setmessage("📤 Resume upload started...");
  
    if (!file) {
      alert("please upload your resume");
      setmessage("❌ Resume upload failed...");
      buttonRef.current.disabled = false;
      return;
    }
  
    // Upload resume file
    const formData = new FormData();
    formData.append("file", file);
  
    const uploadResponse = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());
  
    if (uploadResponse.status === 200) {
      setmessage("✅ Resume uploaded successfully!");
      setmessage("🤖 AI analyzing text...");
  
      const extractResponse = await fetch("/api/extract", {
        method: "POST",
        body: JSON.stringify({ path: uploadResponse.url ,  public_id: uploadResponse.public_id,  }),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json());
  
      if (extractResponse.status === 200) {
        setmessage("🛠️ Generating website content...");
        let cleanedJson = extractResponse.details;
        console.log(cleanedJson);
        setmessage("✨ Finalizing design...");
  
        const renderResponse = await fetch("/api/render", {
          method: "POST",
          body: JSON.stringify({ details: cleanedJson, templates: template, timestamps: timestamp }),
          headers: { "Content-Type": "application/json" },
        });
        
        if (!renderResponse.ok) {           
          setmessage("👀 Rendering failed...");
          throw new Error("Failed to generate HTML");
        }
        
        const { url } = await renderResponse.json();
        buttonRef.current.disabled = false;
        
        previewWithDownload(url);
          
        setmessage("🚀 Website is ready!");
        
      } else {
        setmessage("❌ We couldn't extract data. Is your PDF a scanned or image-based file?");
      }
    } else {
      setmessage("❌ Resume upload failed...");
      console.log(uploadResponse);
    }
  };

  return (
    <div className="bg-zinc-900 h-[fit]">
      <div className="bg-zinc-800 h-14 flex items-center">
        <h1 onClick={() => {window.location.href = "/"}} className="text-xl hover:cursor-pointer font-semibold text-white  ml-5">Resume2Web</h1>
        {session && <div className="flex items-center cursor-pointer  font-medium ml-auto mr-5 text-white" onClick={()=>{setlogout(!logout)}}> <h1>{session.user.name}</h1>
           { logout && <button className="absolute top-[70px] right-5 font-bold bg-red-500 px-1 py-1 rounded-md" onClick={() => signOut()}>Logout</button>}</div>}
          </div>

      { !session && <div className="flex flex-col text-white text-2xl h-[100svh] items-center justify-center">
         <h1>You're not logged in</h1>
         <button className="bg-zinc-600 px-2 py-1 rounded-lg mt-10 text-white font-semibold"  onClick={() => signIn("google")}>Login</button>
        </div> }

      { session && <div>
        <div className="text mx-auto w-fit mt-14">        
          <h1 className="text-xl font-semibold text-white text-center">Upload your resume (PDF) to auto-generate your portfolio ✨</h1>
        </div>
        <form className=" flex flex-col items-center">
          <div className="mt-5 w-fit"> <label htmlFor="resume" className="text-white mr-1 font-semibold">Upload: </label>
          <input type="file" id="resume" name="resume" className="text-zinc-400 cursor-pointer bg-zinc-800 rounded-lg p-1 file:bg-stone-900 file:outline-none file:text-white file:border-none file:rounded-sm file:text-sm file:py-1 file:px-2 file:mr-1" onChange={handleFile}></input></div>
          <p className="text-zinc-400 text-sm mt-1">Format: pdf</p>
          <h1 className="text-xl font-semibold text-white mt-3 text-center">Pick Your Perfect Design ✨</h1>
          <div className="h-fit w-[90vw] mt-8 flex-wrap rounded-xl flex items-center justify-center gap-3">
        {alltemplates.map((mtemplate) => (
          <label key={mtemplate.id} className="cursor-pointer">
            <input type="radio" name="template" value={mtemplate.id} className="hidden peer" checked={template === mtemplate.id} onChange={handleTemplateChange}/>
            <Designs  func={() => settemplate(mtemplate.id)} title={mtemplate.title}  img={mtemplate.img}  desc={mtemplate.desc} />
          </label>
        ))}
      </div>
     
          <button ref={buttonRef} className="px-10 py-2 bg-zinc-800 rounded-lg disabled:text-zinc-700 disabled:hover:bg-zinc-500 text-white font-semibold mt-5 hover:bg-zinc-700 " onClick={uploadFile}>Build My Portfolio</button>
          <p className="mt-5 font-semibold text-green-500">{message}</p>
        </form>
       
        <div className="max-w-[80vw] mx-auto bg-zinc-900 p-6 rounded-lg shadow-md">
    <h1 className="text-2xl font-bold text-white text-center">How to Publish Your Website Online?</h1>
    <p className="text-normal text-zinc-400 mt-2 text-center">
        You have your website ready with an <code>index.html</code> file. Now, let’s get it online for free using simple methods.
    </p>

    <div className="mt-5">
        <h2 className="text-xl font-semibold text-white">🔹 1. Tiiny Host (Easiest Method)</h2>
        <p className="text-zinc-400">
            If you just want a quick and simple way to upload your site, use  
            <a href="https://tiiny.host/" target="_blank" className="text-blue-400 font-medium"> Tiiny Host</a>. 
            Drag and drop your <code>.html or a .zip</code> file containing <code>index.html</code>, and your site is live instantly.
        </p>
    </div>

    <div className="mt-4">
        <h2 className="text-xl font-semibold text-white">🔹 2. GitHub Pages (Best for Long-Term Hosting)</h2>
        <p className="text-zinc-400">
            If you have a GitHub account, you can use 
            <a href="https://pages.github.com/" target="_blank" className="text-blue-400 font-medium"> GitHub Pages</a>.
        </p>
        <ol className="text-zinc-400 list-decimal pl-5">
            <li>Create a new repository on GitHub.</li>
            <li>Upload your <code>index.html</code> and other files.</li>
            <li>Go to "Settings" → "Pages" and select the "main" branch.</li>
            <li>Your website will be live at <code>https://yourusername.github.io/repositoryname/</code>.</li>
        </ol>
    </div>

    <div className="mt-4">
        <h2 className="text-xl font-semibold text-white">🔹 3. Netlify (Drag & Drop Hosting)</h2>
        <p className="text-zinc-400">
            <a href="https://www.netlify.com/" target="_blank" className="text-blue-400 font-medium">Netlify</a> allows you to deploy your website in seconds.
        </p>
        <ol className="text-zinc-400 list-decimal pl-5">
            <li>Go to <a href="https://app.netlify.com/" className="text-blue-400 font-medium">Netlify</a> and sign in.</li>
            <li>Drag and drop your project folder.</li>
            <li>Netlify will instantly deploy your site and give you a free URL.</li>
        </ol>
    </div>

    <div className="mt-4">
        <h2 className="text-xl font-semibold text-white">🔹 4. Vercel (For Developers)</h2>
        <p className="text-zinc-400">
            <a href="https://vercel.com/" target="_blank" className="text-blue-400 font-medium">Vercel</a> is great if you're using GitHub. 
            Just connect your repository, and it deploys automatically.
        </p>
    </div>

    <div className="mt-4">
        <h2 className="text-xl font-semibold text-white">🔹 5. Cloudflare Pages (Fast & Secure)</h2>
        <p className="text-zinc-400">
            <a href="https://pages.cloudflare.com/" target="_blank" className="text-blue-400 font-medium">Cloudflare Pages</a> provides free hosting with a global CDN for fast loading.
            It's great for professional-looking static websites.
        </p>
    </div>

    <div className="mt-6 p-4 bg-zinc-800 rounded-lg text-center">
        <p className="text-zinc-400">
            Choose the easiest method and get your website online in minutes! 🚀
        </p>
    </div>
</div>


      </div>
      }
    </div>
  );
}
