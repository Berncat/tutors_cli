import chalk from "chalk";
import inquirer from "inquirer";
import * as fs from "fs";
import mustache from "mustache";

var labObj = {};

async function lab(response) {
  labObj.title = response;
  console.log("lab");
  console.log(labObj);
}

export default lab;
