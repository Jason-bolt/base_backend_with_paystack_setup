import multer from "multer";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const contributionsMiddleware = {
  uploadPhoto: upload.single("photo"),
};

export default contributionsMiddleware;
