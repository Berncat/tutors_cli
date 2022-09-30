import chalk from "chalk";
import inquirer from "inquirer";
import * as fs from "fs";
import mustache from "mustache";

const courseQuestions = [
  {
    name: "title",
    type: "text",
    message: "Course title?",
    default: "Course title",
    prefix: "",
  },
  {
    name: "desc",
    type: "text",
    message: "Course description?",
    default: "Course description",
  },
];

const propertiesQuestions = [
/*   {
    name: "credits",
    type: "text",
    message: "Who created the course?",
    default: "",
    validate: (value) => {
      return new Promise((resolve, reject) => {
        if (!value) {
          reject("Cannot be empty");
        }
        resolve(true);
      });
    },
  }, */
  {
    name: "comms",
    type: "checkbox",
    message: "What communication tools will you use on this course?",
    choices: ["Slack", "Zoom", "Moodle", "YouTube", "Teams"],
  },
];

async function add() {
  const commsQuestions = [];
  const courseInput = await inquirer.prompt(courseQuestions);
  const propertiesInput = await inquirer
    .prompt(propertiesQuestions)
    .then((answers) => {
      answers.comms.forEach((element) => {
        commsQuestions.push({
          name: element.toLowerCase(),
          type: "text",
          message: `Enter URL for ${element}:`,
        });
      });
    });
  console.log(propertiesInput)
  const commsInput = await inquirer.prompt(commsQuestions);
  const courseTemplate = fs
    .readFileSync("./templates/course/course.md")
    .toString();
  const courseOutput = mustache.render(courseTemplate, courseInput);
  const propertiesTemplate = fs
    .readFileSync("./templates/course/properties.yaml")
    .toString();
  const propertiesOutput = mustache.render(propertiesTemplate, commsInput);
  const dir = `./output`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(`${dir}/course.md`, courseOutput);
  fs.writeFileSync(`${dir}/properties.yaml`, propertiesOutput);
  fs.copyFile(
    `./templates/course/package.json`,
    `${dir}/package.json`,
    async (err) => {
      if (err) throw err;
      console.log("successfully copied package.json");
    }
  );
  fs.copyFile(
    `./templates/course/course.png`,
    `${dir}/course.png`,
    async (err) => {
      if (err) throw err;
      console.log("successfully copied course.png");
    }
  );
  console.log(chalk.green.bold("Course files created"));
}
export default add;
