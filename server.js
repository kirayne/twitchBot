import mongoose from "mongoose";

// Schematic bro to save inside database bro
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  bits: { type: Number, required: true, default: 0 },
});

const User = mongoose.model("users", userSchema);

async function connectToDB() {
  try {
    if (!process.env.MONGODB_URL)
      throw new Error("Missing MONGODB_URL env var");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected");
  } catch (error) {
    console.log("Conection failed", error);
  }
}

async function getUser(username) {
  try {
    let user = await User.findOne({ username });
    if (!user) return void 0;

    return user;
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
  try {
    let user = await getUser(username);
    if (!user) {
      user = new User({ username, bits: bitsToAdd });
    }
    user.bits += bitsToAdd;

    await user.save();
    console.log(`Bits updated for ${username}: ${user.bits}`);
  } catch (error) {
    console.log("Error updating bits ", error);
  }
}

export { User, connectToDB, getUser, updateBits, getBits };
