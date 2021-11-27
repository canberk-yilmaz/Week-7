const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post(
  "/signup",
  [
    check("username", "username is not valid").not().isEmpty(),
    check("email", "email is not valid").isEmail(),
    check(
      "password",
      "password is not valid, it must be between 6-12 characters"
    ).isLength({
      min: 6,
      max: 12,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { username, email, password, age, role } = req.body; //password = 12345678

    try {
      user = new User({ username, email, password, age, role });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        process.env.SECRET_KEY,
        { expiresIn: 10000 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          }); //token: sdkjgflakljdaskdjlak
        }
      );
    } catch (e) {
      console.log(e.message);
      res.status(500).send("error in saving");
    }
  }
);

router.post(
  "/signin",
  [
    check("email", "email is not valid").isEmail(),
    check(
      "password",
      "password is not valid, it must be between 6-12 characters"
    ).isLength({
      min: 6,
      max: 12,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { email, password } = req.body; //password = 12345678

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).send("User not exist");
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send("Incorrect Password");
      }
      const payload = {
        user: {
          user: user.id,
        },
      };
      jwt.sign(
        payload,
        process.env.SECRET_KEY,
        { expiresIn: 10000 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({token});
        }
      );
    } catch (e) {
      console.log(e.message);
      res.status(500).json({ message: e.message });
    }
  }
);

module.exports = router;
