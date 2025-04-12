import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import {v2 as cloudinary} from "cloudinary";
import { mkdir} from "fs/promises";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function POST(req) {

try {
  const formData = await req.formData();
  const file = formData.get("file");

  if(!file){
    return NextResponse.json({error:"no File Found!"},{status:400})
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  // const uploadDir = path.join(process.cwd(),"public/userdata")
  // await mkdir(uploadDir, {recursive:true})

  const timestamp = Date.now();

  const uploadResponse = await cloudinary.uploader.upload(base64, {
    folder: "resume2web",
    resource_type: "raw",
    public_id: `resume_${timestamp}`,
  });
  // const filepath = path.join(uploadDir,`resume_${timestamp}.pdf`)
  // await writeFile(filepath, buffer)


  return NextResponse.json({
    status: 200,
    url: uploadResponse.secure_url,
    public_id: uploadResponse.public_id,
  });

  } catch (error) {
      console.log(error)
  }

}

