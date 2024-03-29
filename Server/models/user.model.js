import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    unique: true,
  },
  displayname: {
    type: String,
    require: true,
  },
  salt: {
    type: String,
    require: true,
    select: false,
  },
});

// 這裡會自動創造password
userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");

  this.password = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

// 對照password + salt
userSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");

  return this.password === hash;
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
