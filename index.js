#! /usr/bin/env node
import { program } from "commander";
import course from "./commands/course.js";
import lab from "./commands/lab.js";
import presentation from "./commands/presentation.js";
import unit from "./commands/unit.js";
import topic from "./commands/topic.js";

program
  .option("-c, --course", "create course", course)
  .option("-l, --lab", "create lab", lab)
  .option("-p, --presentation", "create lab", presentation)
  .option("-t, --topic", "create topic", topic)
  .option("-u, --unit", "create course", unit)

program.parse();
