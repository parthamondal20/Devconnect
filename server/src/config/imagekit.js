import imageKit from "imagekit";

const imageKitInstance = new imageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});
const uploadToImageKit = async (buffer, filename) => {
    const result = await imageKitInstance.upload({
        file: buffer,
        fileName: filename
    });
    return {
        url: result.url,
        fileId: result.fileId
    };
}

const deleteFromImageKit = async (fileId) => {

    try {
        await imageKitInstance.deleteFile(fileId);
    } catch (error) {
        console.error("Error deleting file from ImageKit:", error);
    }
}
export { uploadToImageKit, deleteFromImageKit };