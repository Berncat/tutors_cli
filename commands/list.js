import chalk from "chalk";
import conf from "conf";
const confy = new conf({projectName: "tutors_cli"});;


function list() {
  const todoList = confy.get("todo-list");
  if (todoList && todoList.length) {
    console.log(
      chalk.blue.bold(
        "Tasks in green are done. Tasks in yellow are still not done."
      )
    );
    todoList.forEach((task, index) => {
      if (task.done) {
        console.log(chalk.greenBright(`${index + 1}. ${task.text}`));
      } else {
        console.log(chalk.yellowBright(`${index + 1}. ${task.text}`));
      }
    });
  } else {
    console.log(chalk.red.bold("You don't have any tasks yet."));
  }
}
export default list;
