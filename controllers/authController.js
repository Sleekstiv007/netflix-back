import pkg from "validator";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../db/Usermodel.js";
const saltRounds = 11;

const { isEmail, isEmpty } = pkg;

const checkEmail = (email) => {
  let valid = true;
  if (isEmpty(email) || !isEmail(email)) {
    valid = false;
  }
  return valid;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (obj) => {
  //returns a token with a signature and headers are automatically applied
  return jwt.sign(obj, "been working since the jump", {
    expiresIn: maxAge,
  });
};

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const msg = checkUserDetails({ name, email, password });
  try {
    if (msg.name !== "" || msg.email !== "" || msg.password !== "") {
      res.status(400).json({ msg });
    } else {
      const user = await User.create({
        name,
        email,
        password,
      });
      const token = createToken({ user: user._id });

      res.status(201).json({
        user: {
          name: user.name,
          email: user.email,
          password: user.password,
        },
        token,
      });
    }
  } catch (err) {
    console.log({ err });
    res.status(400).json();
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });
  const validEmail = checkEmail(email);

  try {
    if (validEmail) {
      const user = await User.findOne({ email });

      if (user !== null && user.password === password) {
        const token = createToken({ user: user._id });

        res.status(201).json({
          user,
          token,
        });
      } else {
        res.status(400).json({ error: "Invalid credentials" });
      }
    } else {
      throw Error;
    }
  } catch (err) {
    // console.log({ err });

    let msg = "error during login";
    console.log({ err });
    res.status(400).json({ status: "failed", msg });
  }
};

const editProfile = async (req, res) => {
  const { email, name, phone } = req.body;

  if (checkEmail(email)) {
    try {
      let user = await User.findOne({ email });

      if (!user) {
        res.json({ error: "User Not Found" });
      }

      user = await User.findOneAndUpdate(
        { email },
        { name, phone },
        {
          new: true,
        }
      );

      // sendingMsg('deposit', deposit, 'Update on Deposit', email);
      // sendingMsg('withdrawal', withdrawal, 'Update on Withdrawal', email);
      // sendingMsg('profit', profits, 'Update on Profit', email);

      res.json({ user, msg: "User Edit Successful" });
    } catch (err) {
      res.json({ err: "try again later?" });
    }
  } else {
    res.json({ err: "invalid email" });
  }
};

const getProfile = async (req, res) => {
  if (!req.body.email) {
    res.json({ error: "User Not Found" });
  }

  const { email } = req.body;

  if (checkEmail(email)) {
    try {
      let user = await User.findOne({ email });

      if (!user) {
        res.json({ error: "User Not Found" });
      }

      // sendingMsg('deposit', deposit, 'Update on Deposit', email);
      // sendingMsg('withdrawal', withdrawal, 'Update on Withdrawal', email);
      // sendingMsg('profit', profits, 'Update on Profit', email);

      res.json({ user, msg: "User retrieved" });
    } catch (err) {
      res.json({ err: "try again later?" });
    }
  } else {
    res.json({ err: "invalid email" });
  }
};

const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.json("logout");
};

const checkUserDetails = (details) => {
  let message = { email: "", name: "", password: "" };
  if (!isEmail(details.email)) {
    if (isEmpty(details.email)) {
      message.email = "Email cannot be empty";
    } else {
      message.email = `${details.email} is not a valid email`;
    }
  }
  if (isEmpty(details.name)) message.name = `Name cannot be empty`;
  if (isEmpty(details.password)) {
    message.password = `Password cannot be empty`;
  } else if (details.password.length < 6) {
    message.password = "passord should be more than 6 characters";
  }

  return message;
};


export default {
  signup,
  login,
  logout,
  editProfile,
  getProfile,
};
