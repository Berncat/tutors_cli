import chalk from "chalk";
import * as fs from "fs";
import mustache from "mustache";
import checkFolder from "../utils/check_folder.js";
import __dirname from "../index.js"

let unitObj = {};
let dir = "";

async function unit(input) {
  console.log(chalk.greenBright("Creating unit..."));
  unitObj.title = input;
  let number = await checkFolder("unit");
  dir = "unit-0" + number.toString() + `-${unitObj.title}`;
  compileUnit();
}

function compileUnit() {
  const unitTemplate = fs
    .readFileSync(`${__dirname}/templates/unit/topic.md`)
    .toString();
  const unitOutput = mustache.render(unitTemplate, unitObj);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/topic.md`, unitOutput);
  console.log(chalk.yellow("unit created"));
}

export default unit;
