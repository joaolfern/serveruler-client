import { exec } from "child_process";
import fs from "fs";

function transformToJson(text) {
  const CONST_REGEX = /const IPs: IPs = {[^]*(},}|}})/;
  const UNDESIRED_REGEX = /[\n]+/g;
  const IP_REGEX = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
  const DEVICE_REGEX = /[a-z]*: "\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b"/gi;
  const PERSON_REGEX = /[a-z]*: {[^}]*}/g;

  if (!text) {
    throw new Error("IP text not found");
  }

  const cleanedText = text.replace(UNDESIRED_REGEX, "");
  const desiredText = cleanedText.match(CONST_REGEX)?.[0];

  if (!desiredText) {
    throw new Error("The data entry file was not found");
  }

  const people = desiredText.match(PERSON_REGEX);
  const ips = people?.reduce((acc, person) => {
    const [personId, string] = person.split(/:(.*)/);

    const personDevices = string.match(DEVICE_REGEX)?.reduce((acc, device) => {
      const [deviceId, string] = device.split(/:(.*)/);
      const deviceIp = string.match(IP_REGEX)?.[0];
      return {
        ...acc,
        [deviceId]: deviceIp,
      };
    }, {});

    return {
      ...acc,
      [personId]: personDevices,
    };
  }, {});

  return ips;
}

const execAsync = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`);
        console.error(stderr);
        reject(error);
      } else {
        console.log(`Command executed: ${command}`);
        console.log(stdout);
        resolve();
      }
    });
  });
};

const readFileContent = async (filePath) => {
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    return data;
  } catch (error) {
    console.error(`Error reading file from path: ${filePath}`);
    throw error;
  }
};

async function writeDatabase(filePath, content) {
  try {
    const jsonString = JSON.stringify(content, null, 2);

    await fs.promises.writeFile(filePath, jsonString, "utf-8");
    console.log(`File has been written successfully: ${filePath}`);
  } catch (error) {
    console.error(`Error writing to file: ${filePath}`);
    throw error;
  }
}

async function getFile() {
  const repoUrl = "git@github.com:AGX-Software/ips.git";
  const hasClonedRepo = fs.existsSync("./database");

  if (!hasClonedRepo) {
    await execAsync(
      `git clone ${repoUrl} database`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Standard Error: ${stderr}`);
          return;
        }
        console.log(`Standard Output: ${stdout}`);
      }
    );
  } else {
    await execAsync("cd database");
    await execAsync(`git pull origin main`);
  }

  const tableText = await readFileContent("./database/table.ts");
  const tableJSON = await transformToJson(tableText);
  console.log(tableJSON);
  writeDatabase("public/data.json", tableJSON);
}

await getFile();
