import chalk from "chalk";
import inquirer from "inquirer";
import * as fs from "fs";
import mustache from "mustache";
import yaml from "js-yaml";
import __dirname from "../index.js";
import icon from "../utils/icon.js";

let courseObj = {};
let propertiesObj = {};
let dir = "";

async function course() {
  console.log(chalk.greenBright("Create a course:"));
  await createCourseObj();
  await createPropertiesObj();
  compileCourse();
}

function compileCourse() {
  console.log(chalk.yellow("Creating files..."));
  const courseTemplate = fs
    .readFileSync(`${__dirname}/templates/course/course.md`)
    .toString();
  const courseOutput = mustache.render(courseTemplate, courseObj);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/course.md`, courseOutput);
  console.log(chalk.yellow("course.md created"));
  fs.copyFile(
    `${__dirname}/templates/course/package.json`,
    `${dir}/package.json`,
    (err) => {
      if (err) {
        console.log("Error while creating package.json:", err);
      } else {
        console.log(chalk.yellow("package.json created"));
      }
    }
  );
  fs.copyFile(
    `${__dirname}/templates/course/course.png`,
    `${dir}/course.png`,
    (err) => {
      if (err) {
        console.log("Error while creating course.png:", err);
      }
    }
  );
  createPropertiesYaml();
}

function createPropertiesYaml() {
  let data = yaml.dump(propertiesObj);
  fs.writeFileSync(`${dir}/properties.yaml`, data, "utf8");
  console.log(chalk.yellow("properties.yaml created"));
}

async function createCourseObj() {
  const courseQuestions = [
    {
      name: "title",
      type: "input",
      message: "Course title?",
      default: "Course title",
      validate: (value) => {
        return new Promise((resolve, reject) => {
          dir = `${value}`;
          if (fs.existsSync(dir)) {
            reject(
              "Folder with this course name already exists in current location"
            );
          }
          resolve(true);
        });
      },
    },
    {
      name: "desc",
      type: "input",
      message: "Course description?",
      default: "Course description",
    },
  ];
  courseObj = await inquirer.prompt(courseQuestions);
}

async function createPropertiesObj() {
  propertiesObj = await general();
  propertiesObj = Object.assign(propertiesObj, await parent());
  propertiesObj = Object.assign(propertiesObj, await auth());
  propertiesObj = Object.assign(propertiesObj, await companions());
  propertiesObj = Object.assign(propertiesObj, await icon());
  propertiesObj = Object.assign(propertiesObj, other());
}

async function general() {
  let response = {};
  const generalQuestions = [
    {
      name: "credits",
      type: "input",
      message: "Who created the course?",
      validate: (value) => {
        return new Promise((resolve, reject) => {
          if (!value) {
            reject("Cannot be empty");
          }
          resolve(true);
        });
      },
    },
    {
      name: "ignorepin",
      type: "input",
      message: "Set your ignore pin:",
      validate: (value) => {
        return new Promise((resolve, reject) => {
          if (!value) {
            reject("Cannot be empty");
          }
          if (isNaN(value)) {
            reject("Must be a number");
          }
          resolve(true);
        });
      },
    },
  ];
  await inquirer.prompt(generalQuestions).then((generalAnswers) => {
    generalAnswers.ignorepin = Number(generalAnswers.ignorepin);
    response = generalAnswers;
  });
  return response;
}

async function parent() {
  let response = {};
  const initialQuestion = [
    {
      name: "confirm",
      type: "list",
      message: "Set parent course?",
      choices: [
        { name: "Yes", value: 1 },
        { name: "No", value: 0 },
      ],
    },
  ];
  const parentQuestion = [
    {
      name: "parent",
      type: "input",
      message:
        "Parent course URL? (example: course/wit-hdip-comp-sci-2022.netlify.app)",
      validate: (value) => {
        return new Promise((resolve, reject) => {
          if (!value) {
            reject("Cannot be empty");
          }
          resolve(true);
        });
      },
    },
  ];
  await inquirer.prompt(initialQuestion).then(async (initialAnswer) => {
    if (initialAnswer.confirm == 1) {
      response = await inquirer.prompt(parentQuestion);
    }
  });
  return response;
}

async function auth() {
  let response = {};
  const authQuestions = [
    {
      name: "auth",
      type: "list",
      message: "Enable Github authentication?",
      choices: [
        { name: "Yes", value: 1 },
        { name: "No", value: 0 },
      ],
    },
  ];
  response = await inquirer.prompt(authQuestions)
  return response
}

async function companions() {
  let response = {};
  let companionQuestions = [
    {
      name: "companions",
      type: "checkbox",
      message: "What communication tools will you use on this course?",
      choices: ["Slack", "Zoom", "Moodle", "YouTube", "Teams"],
    },
  ];
  await inquirer.prompt(companionQuestions).then((companionAnswers) => {
    companionQuestions = [];
    companionAnswers.companions.forEach((element) => {
      companionQuestions.push({
        name: element.toLowerCase(),
        type: "input",
        message: `Enter URL for ${element} (include URL protocol):`,
        validate: (value) => {
          return new Promise((resolve, reject) => {
            if (!value) {
              reject("Cannot be empty");
            }
            resolve(true);
          });
        },
      });
    });
  });
  response = await inquirer.prompt(companionQuestions)
  return response
}

function other() {
  let otherObj = {
    hideVideos: false,
    ignore: [null],
  };

  return otherObj
}

export default course;
