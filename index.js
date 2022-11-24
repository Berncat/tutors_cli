#! /usr/bin/env node
import { program } from "commander";
import course from "./commands/course.js";
import lab from "./commands/lab.js";
import presentation from "./commands/presentation.js";
import unit from "./commands/unit.js";
import topic from "./commands/topic.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default __dirname

program
  .name("tutors")
  .description("Help you scaffold elements for Tutors open source project");

program
  .option("-c, --course", "create course", course)
  .option("-l, --lab", "create lab", lab)
  .option("-p, --presentation", "create lab", presentation)
  .option("-t, --topic", "create topic", topic)
  .option("-u, --unit <title>", "create course", unit)

program.parse();

if (process.argv.length < 3) {
  program.help();
}

