const mongoose = require("mongoose");

const User = mongoose.model("users", userSchema);

// Schematic bro to save inside database bro
const userSchema = new mongoose.Schema({
  username: String,
  bits: Number,
});

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected");
  } catch (error) {
    console.log("Conection failed", error);
  }
}

async function getUser(username) {
  try {
    let user = await User.findOne({ username });
    if (!user) return false;

    return user.username;
  } catch (error) {
    console.log(error);
  }
}

async function getBits(username) {
  try {
    let user = await getUser(username);
    if (!user) return;

    return user.bits;
  } catch (error) {
    console.log(error);
  }
}

async function updateBits(username, bitsToAdd) {
  try {
    let user = await getUser(username);
    if (!user) {
      user = new User({ username, bits: 0 });
    }
    user.bits += bitsToAdd;

    await user.save();
  } catch (error) {
    console.log("Error updating bits ", error);
  }
}

module.exports = { connect, getUser, updateBits, getBits };
