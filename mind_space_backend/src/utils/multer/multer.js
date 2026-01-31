import multer, { diskStorage } from "multer";

export const fileValidation = {
  images: ["image/png", "image/jpeg", "image/jpg"],
  video: ["video/mp4", "video/mpeg"],
};

export const cloudUpload = (allowedTypes) => {
  try {
    const storage = diskStorage({});

    const fileFilter = (req, file, cb) => {
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("this file type is not allowed"), false);
      }
      return cb(null, true);
    };

    return multer({ storage, fileFilter });
  } catch (error) {
    console.log(error.message);
  }
};

