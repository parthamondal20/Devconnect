import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(), // store files in memory buffer
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only .png, .jpg, and .jpeg formats allowed!"));
  },
});
