const mongoose = require("mongoose");

// Schematic bro to save inside database bro
const userSchema = new mongoose.Schema({
  username: String,
  bits: Number,
});

const User = mongoose.model("users", userSchema);

async function connectToDB() {
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
    const user = await getUser(username);
    if (user) {
      return user.bits;
    }
    return 0; // Thats if user doesnt exist return 0
  } catch (error) {
    console.log(error);
    return 0; // if error = 0
  }
}

async function updateBits(username, bitsToAdd) {
  console.log("taaqui");
  try {
    let user = await getUser(username);
    if (!user) {
      user = new User({ username, bits: bitsToAdd });
      console.log("taaqui2");
    }
    user.bits += bitsToAdd;

    await user.save();
  } catch (error) {
    console.log("Error updating bits ", error);
  }
}

module.exports = { connectToDB, getUser, updateBits, getBits };
