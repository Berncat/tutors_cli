import chalk from "chalk";
import inquirer from "inquirer";
import * as fs from "fs";
import mustache from "mustache";

var presentationObj = {};

async function presentation(response) {
  presentationObj.title = response;
  console.log("presentation");
  console.log(presentationObj);
}

export default presentation;
