import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadedImage = async (
  imgFile: Express.Multer.File
): Promise<string> => {
  try {
    const b64 = Buffer.from(imgFile.buffer).toString("base64");
    const dataURI = `data:${imgFile.mimetype};base64,${b64}`;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.secure_url;
  } catch (error) {
    throw new Error("Failed to upload image");
  }
};
