const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
  projectId: "ogcstoarge",
  keyFilename: "firebase.json",
});

let bucketName = "ogcstoarge.appspot.com";
const uploadFile = async (filename, newFileName) => {
  const bucket = storage.bucket(bucketName);
  const blob = bucket.file(newFileName);

  const newPromise = new Promise((resolve, reject) => {
    blob
      .createWriteStream({
        metadata: {
          contentType: "image/jpeg" || "image/png",
        },
        resumable: false,
      })
      .on("error", (err) => {
        reject("upload error: ", err.message);
      })
      .on("finish", async (response) => {
        blob.makePublic();
        console.log(blob.publicUrl());
        resolve(response);
      })
      .end(filename.buffer);
  });
  return newPromise;
};

/**
 * Delete File from Google Storage
 * @param {String} file fileName
 */
const deleteFile = async (filename) => {
  try {
    const bucket = storage.bucket(bucketName);
    const basicFileName = filename.split(
      "https://storage.googleapis.com/ogcstoarge.appspot.com/"
    );
    await bucket.file(basicFileName[1]).delete();
    return true;
  } catch {
    return false;
  }
};

exports.deleteFile = deleteFile;
exports.uploadFile = uploadFile;
