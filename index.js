const tmi = require("tmi.js"),
  { channel, username } = require("./settings.json");
const ballAnswers = require("./ballAnswers");
const { connect, updateBits, getBits } = require("./server");

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
    passsowrd: `${process.env.TWITCH_TOKEN}`,
  },
  channels: [channel],
};

// Connect mongoDB
connect();

const client = new tmi.client(options);
client.connect().catch(console.error);

client.on("connected", () => {
  client.say(channel, "catArrive");
});

//when someone cheer
client.on("cheer", (channel, userstate, message) => {
  bitsHandler(userstate.username, Number(userstate.bits));
});

client.on("message", (channel, user, message, self) => {
  //if message came from bot, we ignore
  if (self) return;
  const { username } = user; // const username = user.username

  switch (message) {
    case "!lyu":
      client.say(
        channel,
        `Lyu? A big cutie! AMAZING ARTIST give them some support - precious and adorable -> https://twitter.com/Lyuriv and https://www.twitch.tv/lyuriv`
      );
      return;
    case "!8ball":
      client.say(
        channel,
        ballAnswers[Math.floor(Math.random() * ballAnswers.length)]
      );
      return;
    case "!cloud":
      sendMessage(
        `Cloud is big baka and we love them uwu go follow: https://twitch.tv/KrCloudVT`
      );
      return;
    case "!botcheck":
      sendMessage(`MrDestructoid 7 `);
      return;
    case "!rolls":
      sendMessage(`You have ` + getExtraRolls(username) + ` rolls left`);
      return;
    case "!roll":
      const extraRolls = getExtraRolls(username); // Get the number of rolls

      if (
        usedCommand.has(username) &&
        extraRolls <= 0 &&
        username !== "natsubun"
      ) {
        return sendMessage(
          `${username}, you have no rolls left natsuLaughing `
        );
      }

      if (extraRolls > 0) {
        bitsHandler(username, -extraRollCost);
        roll(username, rollRange / 2);
        return;
      }

      usedCommand.add(username);
      roll(username, rollRange);
  }
});

function sendMessage(message) {
  client.say(channel, message);
}

function bitsHandler(username, bits) {
  updateBits(username, bits);
}

//controls the users who cheered  <<<<<<<<<<<<<<< ARRUMAR
async function getExtraRolls(username) {
  return parseInt((await getBits(username)) / extraRollCost);
}

function roll(username, roll_range) {
  commandInProcess = true; //Flag to not append users who havent rolled
  sendMessage(`@${username} 69 today? PauseChamp You rolled a... PauseChamp`);
  setTimeout(() => {
    commandInProcess = false;
    const roll = Math.floor(Math.random() * roll_range) + 1; // generate a random number between 1 and 1000
    if (roll === 69 || roll === 420) {
      return sendMessage(
        `@${username} You rolled a ${roll}... Oh no natsuPanic`
      );
    }

    sendMessage(
      `@${username} natsuLaughing better luck tomorrow nerd natsuHehehehehe you rolled a ${roll}!`
    );
  }, 1500);
}

//detects when i press control C to stop the bot
process.on("SIGINT", () => {
  sendMessage(`cya nerds peepoLeaveFinger`);
  process.exit();
});
