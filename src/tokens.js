/*global process*/

import theo from "theo";
import fs from "fs";

const OUTPUT = "dist";
const SOURCE = "src/tokens";

const files = {
  scss: `${OUTPUT}/index.scss`,
};

function createDir(dirPath) {
  fs.mkdirSync(`${process.cwd()}/${dirPath}`, { recursive: true }, (error) => {
    if (error) throw error;
  });
}

function createFile(filePath, fileContent) {
  fs.writeFile(filePath, fileContent, (err) => {
    if (err) throw err;
    console.log("The file was succesfully saved!");
  });
}

async function generateTokens() {
  theo.registerTransform("web", ["color/hex"]);

  theo
    .convert({
      transform: {
        type: "web",
        file: `${SOURCE}/colors.json`,
      },
      format: {
        type: "scss",
      },
    })
    .then((scss) => {
      !fs.existsSync(OUTPUT) ? createDir(OUTPUT) : createFile(files.scss, scss);
    })
    .catch((error) => console.log(`Something went wrong: ${error}`));
}

generateTokens();
