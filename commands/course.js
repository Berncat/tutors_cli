import chalk from "chalk";
import inquirer from "inquirer";
import * as fs from "fs";
import mustache from "mustache";
import yaml from "js-yaml";

let courseObj = {};
let propertiesObj = {};
let dir = "";

async function course() {
  console.log(chalk.greenBright("Create a course:"));
  await createCourseObj();
  await createPropertiesObj();
  compileCourse();
  console.log(chalk.greenBright("Course created"));
}

function compileCourse() {
  console.log(chalk.yellow("Creating files..."));
  const courseTemplate = fs
    .readFileSync(`./templates/course/course.md`)
    .toString();
  const courseOutput = mustache.render(courseTemplate, courseObj);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/course.md`, courseOutput);
  console.log(chalk.yellow("course.md created"));
  fs.copyFile(
    `./templates/course/package.json`,
    `${dir}/package.json`,
    (err) => {
      if (err) {
        console.log("Error while creating package.json:", err);
      } else {
        console.log(chalk.yellow("package.json created"));
      }
    }
  );
  fs.copyFile(`./templates/course/course.png`, `${dir}/course.png`, (err) => {
    if (err) {
      console.log("Error while creating course.png:", err);
    }
  });
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
          dir = `./${value}`;
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
  await general();
  await parent();
  await auth();
  await companions();
  await icon();
  other();
}

async function general() {
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
    propertiesObj = generalAnswers;
  });
}

async function parent() {
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
      propertiesObj = Object.assign(
        propertiesObj,
        await inquirer.prompt(parentQuestion)
      );
    }
  });
}

async function auth() {
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
  propertiesObj = Object.assign(
    propertiesObj,
    await inquirer.prompt(authQuestions)
  );
}

async function companions() {
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
  propertiesObj = Object.assign(
    propertiesObj,
    await inquirer.prompt(companionQuestions)
  );
}

async function icon() {
  const iconQuestions = [
    {
      name: "icon",
      type: "list",
      message: "Use iconify or png for icon?",
      choices: [
        { name: "iconify", value: 1 },
        { name: "png", value: 0 },
      ],
    },
  ];
  const iconifyQuestions = [
    {
      name: "type",
      type: "input",
      message: "iconify icon name?",
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
      name: "iconColor",
      type: "list",
      message: "If applciable would you like to set the colour of your icon?",
      choices: [
        { name: "Yes", value: 1 },
        { name: "No", value: 0 },
      ],
    },
  ];
  const colorQuestions = [
    {
      name: "color",
      type: "input",
      message: "Input icon colour hex value (exclude #):",
      default: "000000",
    },
  ];
  await inquirer.prompt(iconQuestions).then(async (iconAnswer) => {
    if (iconAnswer.icon == 1) {
      let iconObj = {};
      await inquirer.prompt(iconifyQuestions).then(async (iconifyAnswers) => {
        iconObj.icon = {};
        iconObj.icon.type = iconifyAnswers.type;
        if (iconifyAnswers.iconColor == 1) {
          await inquirer.prompt(colorQuestions).then(async (colorAnswers) => {
            iconObj.icon.color = colorAnswers.color;
          });
        }
      });
      propertiesObj = Object.assign(propertiesObj, iconObj);
    } else {
      console.log(
        chalk.red.bold(
          "Update course.png file with your image (Do not change name from course.png)"
        )
      );
    }
  });
}

function other() {
  let otherObj = {
    hideVideos: false,
    ignore: [null],
  };

  propertiesObj = Object.assign(propertiesObj, otherObj);
}

export default course;
