import chalk from "chalk";
import inquirer from "inquirer";
import * as fs from "fs";
import mustache from "mustache";

var topicObj = {};

async function topic(response) {
  topicObj.title = response;
  console.log("topic");
  console.log(topicObj);
}

export default topic;
