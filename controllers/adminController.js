import pkg from "validator";
import nodemailer from "nodemailer";
import User from "../db/Usermodel.js";

const { isEmail, isEmpty } = pkg;

// Utility functions
const checkEmail = (email) => {
  let valid = true;
  if (isEmpty(email) || !isEmail(email)) {
    valid = false;
  }
  return valid;
};

export const allUsers = async (req, res) => {
  const users = await User.find({});

  const filtered = users.filter((user) => user.role !== "admin");

  res.json({ users: filtered, count: filtered.length });
};



export const editUser = async (req, res) => {
  const { email, name, withdrawal, deposit, balance, profits } = req.body;

  if (checkEmail(email)) {
    try {
      let user = await User.findOne({ email });

      if (!user) {
        res.json({ error: "User Not Found" });
      }

      user = await User.findOneAndUpdate(
        { email },
        { name, withdrawal, deposit, balance, profits },
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

export const deleteUser = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  // console.log('user', user);

  if (!user) {
    // console.log('no user to delete');
    res.json({ msg: "email not found" });
  } else if (user.role !== "admin") {
    //if not the admin delete
    await User.findOneAndRemove({ email });
    res.json({ msg: "user deleted successfully" });
  }
};

