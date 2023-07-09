const tmi = require("tmi.js"),
  { channel, username, password } = require("./settings.json");
//const fs = require('fs'); //tp read the json file
//const Trie = require('./Trie');
//const jsonfile = require('jsonfile')

const markovChain = {};
const usedCommand = new Set();
let commandInProcess = false;
const cheeredBits = {};
//const blacklistTrie = new Trie();

const options = {
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username,
    password,
  },
  channels: [channel],
};

// // Read the JSON file
// const rawData = fs.readFileSync('blacklist.json');
// const blacklist = JSON.parse(rawData);

// //Insert words from the blacklist into the Trie
// // blacklist.blacklist.forEach(word => {
// //   blacklistTrie.insert(word);
// // });
// /*
// function logTrie(root) {
//   console.log(root);
//   for (const key in root.children) {
//     logTrie(root.children[key]);
//   }
// }
// logTrie(trie.root); */

const ballAnswers = [
  "YEP kok ",
  "Yes. Suske ",
  "Lyuuuuuuuuuuuuuuuuuuu said yes.",
  "bababababa = NODDERS",
  "You may rely on deez nuts NODDERS .",
  "As I see it, yes... Suske ",
  "Most likely. meow",
  "Outlook good. ChadJam ",
  "Yes. Smadge ",
  "Signs point to yes. Smadge ",
  "Ask again later. PogO",
  "Better not tell you now. Plotge ",
  "Cannot predict now. So sorry natsuHehehehehe  ",
  "Ask your father KEKWlaugh ",
  "Ask your mom KEKWlaugh ",
  "Don't count on it. NOPERS ",
  "Outlook not so good. Smadge ",
  "My sources say no. LUBBERS ",
  "Very doubtful.",
  " COPIUM ",
  "I don't know... I only know that WE LOST LYUUUUUUUUUUUUU natsuWhyy natsuCryALot  natsuWhyy natsuCryALot  natsuWhyy natsuCryALot  ",
  "Not everything is certain, but if there's one thing you can count on, it's that C_Killah will always be drunk.",
  "KILLAH STOP ASKING ME QUESTIONS. NATSU HELP! natsuPanic ",
];

//const dataRaw = fs.readFileSync('Users.json');
//const userMessages = JSON.parse(dataRaw);

// function saveMessageToJson(username,message){
//check if user is already inside json
//call function formatMessage(message)
//if message after deletion = empty array then do nothing

//if it is:
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes-
//check if word was already sent before (if its inside json)
//if doenst include the word
//append new word into json file

//if not:
//then put message inside the file

//   // const jsonMessage = {};
//   // jsonMessage[username] = [words];

//   // if (userMessages[username] === undefined) {
//   //   userMessages[username] = [];
//   // }

//   // fs.writeFileSync('Users.json', JSON.stringify(jsonMessage));

// }

// function formatMessage3(message){
//   const words = message.split(' ').slice(0, 5);
// }

//   //split the message = inside words
//   //then check if the msg contains blaclisted words
//   //delete the blacklist words

const client = new tmi.client(options);
client.connect().catch(console.error);

client.on("connected", () => {
  client.say(channel, "Bot connected");
});

//when someone cheer
client.on("cheer", (channel, userstate, message) => {
  bitsHandler(userstate);
});

function bitsHandler(user) {
  if (cheeredBits[user] === undefined) {
    cheeredBits[user] = user.bits;
  } else {
    cheeredBits[user] += user.bits;
  }
}

function getRolls(user) {
  return (gambaRolls = parseInt(cheeredBits[user] / 500));
}

function roll() {
  commandInProcess = true; //Flag to not append users who havent rolled
  client.say(
    channel,
    `@${user.username} 69 today? PauseChamp You rolled a... PauseChamp`
  );
  setTimeout(() => {
    commandInProcess = false;
    const roll = Math.floor(Math.random() * 1000) + 1; // generate a random number between 1 and 1000
    if (roll === 69) {
      return client.say(
        channel,
        `@${user.username} You rolled a 69... Oh no natsuPanic`
      );
    }

    client.say(
      channel,
      `@${user.username} natsuLaughing better luck tomorrow nerd natsuHehehehehe you rolled a ${roll}!`
    );
  }, 1500);
}

client.on("message", (channel, user, message, self) => {
  //if message came from bot, we ignore
  if (self) return;

  //saveMessageToJson(user.username, message);

  if (message.toLowerCase().startsWith("!lyu")) {
    client.say(
      channel,
      `Lyu? A big cutie! AMAZING ARTIST give them some support - precious and adorable -> https://twitter.com/Lyuriv and https://www.twitch.tv/lyuriv`
    );
  }

  if (message.toLowerCase().startsWith("!8ball")) {
    client.say(
      channel,
      ballAnswers[Math.floor(Math.random() * ballAnswers.length)]
    );
  }
  if (message.toLowerCase().startsWith("!cloud")) {
    client.say(
      channel,
      `Cloud is big baka and we love them uwu go follow: https://twitch.tv/KrCloudVT`
    );
  }
  if (message.toLowerCase().startsWith("!botcheck")) {
    client.say(channel, `MrDestructoid 7 `);
  }

  if (message.toLowerCase().startsWith("!roll")) {
    const rolls = getRolls(userstate); // Get the number of rolls

    if (
      usedCommand.has(user.username) &&
      rolls <= 0 &&
      user.username !== "natsubun"
    ) {
      return client.say(
        channel,
        `${user.username}, you have no rolls left natsuLaughing `
      );
    }

    if (rolls > 0) {
      bitsHandler({ user: userstate.user, bits: -500 });
      roll();
      return;
    }

    usedCommand.add(user.username);
    roll();
  }
});
