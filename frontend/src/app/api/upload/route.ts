import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file") as File[];
    const singleFile = formData.get("file") as File | null;

    const uploadedFiles: Array<{
      id: string;
      name: string;
      url: string;
      size: number;
      type: string;
    }> = [];

    const fileList = files.length > 0 ? files : singleFile ? [singleFile] : [];

    if (fileList.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided in multipart request." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const file of fileList) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || ".bin";
      const fileId = `up-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const fileName = `${fileId}${ext}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);

      uploadedFiles.push({
        id: fileId,
        name: file.name,
        url: `/uploads/${fileName}`,
        size: file.size,
        type: file.type,
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      url: uploadedFiles[0]?.url,
      file: uploadedFiles[0],
      message: `Uploaded ${uploadedFiles.length} file(s) successfully.`,
    });
  } catch (error: any) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload file." },
      { status: 500 }
    );
  }
}
