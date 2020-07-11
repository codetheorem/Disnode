const showBanner = require("node-banner");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const https = require("https");
const axios = require("axios");
const ora = require("ora");
var inquirer = require("inquirer");

module.exports = {
  async execute(appname) {
    await showBanner("DisNode", "CLI tool for discord.js");
    console.log("");

    var questions = [
      {
        type: "list",
        name: "template",
        message: "Select template:",
        choices: ["basic", "default (recommended)", "advanced"],
        filter: function (val) {
          return val.toLowerCase();
        },
      },
    ];

    inquirer.prompt(questions).then((answers) => {
      if (answers.template === "basic") {
        fs.mkdir(path.join(process.cwd(), appname), () => {
          console.log(chalk.green("Created basic template"));
        });
        var data = null;
        const spinner = ora("Loading files").start();
        console.log("");

        axios
          .get(
            "https://api.github.com/repos/Bot-Academia/disnode/contents/template"
          )
          .then(async (res) => {
            arr = res.data;
            var i = 0;
            while (i < arr.length) {
              name = arr[i].name;
              console.log("");
              console.log(name);
              await axios
                .get(
                  `https://api.github.com/repos/Bot-Academia/disnode/contents/template/${name}`
                )
                .then((res) => {
                  text = res.data.content;
                  let buff = Buffer.from(text, "base64");
                  let data = buff.toString("ascii");
                  fs.appendFileSync(
                    path.join(process.cwd(), `${appname}/${name}`),
                    data,
                    function (e) {
                      if (e) console("some error");
                      console.log("Saved!");
                    }
                  );
                });
              i++;
            }
            spinner.stop();
          });
      }

      if (answers.template === "default (recommended)") {
        console.log("default");
      }

      if (answers.template === "advanced") {
        console.log("advanced");

        var advanced = [
          {
            type: "input",
            name: "env",
            message: "Enter your Discord bot token",
            validate: function (value) {
              var pass = false;
              if (value.length > 25) {
                pass = true;
              }
              if (pass) {
                return true;
              }

              return "Please enter a valid bot token";
            },
          },
        ];
        inquirer.prompt(advanced).then((choice) => {
          fs.mkdir(path.join(process.cwd(), appname), () => {
            console.log(chalk.green("Created basic template"));
          });
          var data = null;
          const spinner = ora("Loading files").start();
          console.log("");

          axios
            .get(
              "https://api.github.com/repos/Bot-Academia/disnode/contents/template"
            )
            .then(async (res) => {
              arr = res.data;
              var i = 0;
              while (i < arr.length) {
                name = arr[i].name;
                console.log("");
                console.log(name);
                await axios
                  .get(
                    `https://api.github.com/repos/Bot-Academia/disnode/contents/template/${name}`
                  )
                  .then((res) => {
                    text = res.data.content;
                    let buff = Buffer.from(text, "base64");
                    let data = buff.toString("ascii");
                    fs.appendFileSync(
                      path.join(process.cwd(), `${appname}/${name}`),
                      data,
                      function (e) {
                        if (e) console("some error");
                        console.log("Saved!");
                      }
                    );
                  });
                i++;
              }
              fs.appendFile(
                `${appname}/.env`,
                "BOT_TOKEN=" + choice.env,
                function (err) {
                  if (err) throw err;
                  console.log(".env file created!");
                }
              );
              spinner.stop();
            });
        });
      }
    });
  },
};
