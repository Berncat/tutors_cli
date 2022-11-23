import chalk from "chalk";
import inquirer from "inquirer";
import * as fs from "fs";
import mustache from "mustache";

var unitObj = {};

async function unit(response) {
  unitObj.title = response;
  console.log("unit");
  console.log(unitObj);
}

export default unit;
