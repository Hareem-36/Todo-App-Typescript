#! /usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";

async function main() {
  let todos = [];
  let loop = true;

  while (loop) {
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What do you want to do?",
        choices: ["Add todo", "Update todo", "Delete todo", "Finish"],
      },
      {
        type: "input",
        name: "todo",
        message: "Enter the todo: ",
        when: (answers) => answers.action === "Add todo",
      },
      {
        type: "input",
        name: "index",
        message: "Enter the index of the todo to update or delete: ",
        validate: (input) => {
          if (!input.match(/^[0-9]+$/)) {
            return "Please enter a valid index";
          }
          return true;
        },
        when: (answers) =>
          ["Update todo", "Delete todo"].includes(answers.action),
      },
    ]);

    const { action, todo, index } = answers;

    switch (action) {
      case "Add todo":
        todos.push(todo);
        console.log(chalk.green("Todo added:", todo)); // Green color for success message
        break;
      case "Update todo":
        if (index >= 0 && index < todos.length) {
          const updatedTodo = await inquirer.prompt({
            type: "input",
            name: "updatedTodo",
            message: "Enter the updated todo: ",
          });
          todos[index] = updatedTodo.updatedTodo;
          console.log(chalk.blue("Todo updated:", todos[index])); // Blue color for updated message
        } else {
          console.log(chalk.red("Invalid index, no todo updated.")); // Red color for error message
        }
        break;
      case "Delete todo":
        if (index >= 0 && index < todos.length) {
          const deletedTodo = todos.splice(index, 1);
          console.log(chalk.yellow("Todo deleted:", deletedTodo[0])); // Yellow color for deletion message
        } else {
          console.log(chalk.red("Invalid index, no todo deleted.")); // Red color for error message
        }
        break;
      case "Finish":
        loop = false;
        break;
    }
  }

  if (todos.length > 0) {
    console.log(chalk.cyan("Your todo List:")); // Cyan color for list header
    todos.forEach((todo) => {
      console.log(todo);
    });
  } else {
    console.log(chalk.yellow("No todos found")); // Yellow color for empty list message
  }
}

main();
