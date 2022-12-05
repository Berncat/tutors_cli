import chalk from "chalk";
import inquirer from "inquirer";

async function icon() {
  let response = {};
  const iconQuestions = [
    {
      name: "icon",
      type: "list",
      message: "Use iconify or file for icon?",
      choices: [
        { name: "iconify", value: 1 },
        { name: "file", value: 0 },
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
          await inquirer.prompt(colorQuestions).then((colorAnswers) => {
            iconObj.icon.color = colorAnswers.color;
          });
        }
      });
      response = iconObj;
    } else {
      console.log(
        chalk.red.bold(
          "Update course.png file with your image (Do not change name from course.png)"
        )
      );
    }
  });
  return response
}

export default icon;
