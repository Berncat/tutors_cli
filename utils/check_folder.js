import * as fs from "fs";

async function checkFolder(type) {
  let myPromise = new Promise(async function (resolve) {
    let count = 1;
    fs.readdir(".", (err, files) => {
      if (err) {
        console.log(err);
      } else {
        files.forEach((file) => {
          if (fs.statSync(file).isDirectory()) {
            if (file.startsWith(type)) {
              count++;
            }
          }
        });
      }
      resolve(count);
    });
  });
  return await myPromise;
}

export default checkFolder;
