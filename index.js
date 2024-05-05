import * as tmi from "tmi.js";
import ballAnswers from "./ballAnswers.js";
import { User, updateBits, getBits, connectToDB } from "./server.js";
const channel = process.env.TWITCH_CHANNEL;

const markovChain = {};
let commandInProcess = false;
const usedCommand = new Set();
const extraRollCost = 1000;
const rollRange = 1000;

const options = {
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: `${process.env.TWITCH_USERNAME}`,
    password: `${process.env.TWITCH_TOKEN}`,
  },
  channels: [channel],
};

await connectToDB(); // Connect mongoDB

const client = new tmi.client(options);
client.connect().catch(console.error); // Connect to Twitch

client.on("connected", () => {
  console.log("client connected");
});

// When someone cheer
client.on("cheer", (channel, userstate, message) => {
  updateBits(userstate.username, Number(userstate.bits));
});

client.on("message", async (channel, user, message, self) => {
  // If message came from bot, we ignore
  if (self) return;
  const { username } = user; // const username = user.username
  const [command, ...args] = message.toLowerCase().split(" ");

  switch (command) {
    case "!lyu":
      client.say(
        channel,
        `Lyu? A big cutie! AMAZING ARTIST give them some support - precious and adorable -> https://twitter.com/Lyuriv and https://www.twitch.tv/lyuriv`
      );
      break;
    case "!reset": // Reset the free rolls
      if (username === "natsubun") {
        usedCommand.clear();
      }
      break;
    case "!8ball":
      client.say(
        channel,
        ballAnswers[Math.floor(Math.random() * ballAnswers.length)]
      );
      break;
    case "!cloud":
      client.say(
        channel,
        `Cloud is big baka and we love them uwu go follow: https://twitch.tv/KrCloudVT`
      );
      break;
    case "!botcheck":
      client.say(channel, `MrDestructoid 7 `);
      break;
    // case "!pausetits":
    //   pauseReedems();
    case "!rolls":
      client.say(
        channel,
        `You have ` + (await getExtraRolls(username)) + ` p2w roll(s) left`
      );
      break;
    case "!dead":
      client.say(channel, `Streamer (Dead) PopCorn natsu3Hehehe`);
      break;
    case "!roll":
      const extraRolls = await getExtraRolls(username); // Get the number of rolls

      if (
        usedCommand.has(username) &&
        extraRolls <= 0 &&
        username !== "natsubun"
      ) {
        return client.say(
          channel,
          `${username}, you have no rolls left natsuLaughing `
        );
      }
      if (extraRolls > 0) {
        updateBits(username, -extraRollCost);
        console.log(getBits(username.bits));
        roll(username, rollRange / 2);
        return;
      }
      usedCommand.add(username);
      console.log(usedCommand);
      roll(username, rollRange);
  }
});

// Controls the users who cheered
async function getExtraRolls(username) {
  return parseInt((await getBits(username)) / extraRollCost);
}

function roll(username, roll_range) {
  commandInProcess = true; // Flag to not append users who havent rolled
  client.say(
    channel,
    `@${username} 69 today? PauseChamp You rolled a... PauseChamp`
  );
  setTimeout(() => {
    commandInProcess = false;
    const roll = Math.floor(Math.random() * roll_range) + 1; // Generate a random number between 1 and 1000
    if (roll === 69 || roll === 420 || roll === 666) {
      return client.say(
        channel,
        `@${username} You rolled a ${roll}... Oh no natsuPanic`
      );
    }

    client.say(
      channel,
      `@${username} natsuLaughing better luck tomorrow nerd natsuHehehehehe you rolled a ${roll}!`
    );
  }, 1500);
}

// Detects when I press control C to stop the bot
process.on("SIGINT", () => {
  client.say(channel, `cya nerds peepoLeaveFinger`);
  process.exit();
});
