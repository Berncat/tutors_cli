import chalk from "chalk";
import inquirer from "inquirer";
import * as fs from "fs";
import mustache from "mustache";
import checkFolder from "../utils/check_folder.js";
import __dirname from "../index.js"

let topicObj = {};
let dir = "";

async function topic(input) {
  console.log(chalk.greenBright("Creating topic..."));
  topicObj.title = input;
  let number = await checkFolder("topic");
  dir = "topic-0" + number.toString() + `-${topicObj.title}`;
  compileTopic();
}

function compileTopic() {
  const unitTemplate = fs
    .readFileSync(`${__dirname}/templates/topic/topic.md`)
    .toString();
  const unitOutput = mustache.render(unitTemplate, unitObj);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/topic.md`, unitOutput);
  console.log(chalk.yellow("unit created"));
}

export default topic;
