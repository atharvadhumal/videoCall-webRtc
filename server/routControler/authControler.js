import User from "../schema/userSchema.js";
import bcrypt from "bcryptjs";
import jwtToken from "../utils/jwtToken.js";

//signup
export const Signup = async (req, res) => {
  try {
    const { fullname, username, email, password, gender, profilepic } =
      req.body;
    const user = await User.findOne({ username });
    if (user)
      return res
        .status(500)
        .send({ success: false, message: "Username already exists" });

    const emailpresent = await User.findOne({ email });
    if (emailpresent)
      return res
        .status(500)
        .send({ success: false, message: "Email already exists" });

    const hashPassword = bcrypt.hashSync(password, 10);
    const boyppf =
      profilepic ||
      `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlppf =
      profilepic ||
      `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashPassword,
      gender,
      profilepic: gender === "male" ? boyppf : girlppf,
    });
    if (newUser) {
      await newUser.save();
    } else {
      res.status(500).send({ success: false, message: "Invalid user data" });
    }
    res
      .status(201)
      .send({ success: true, message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
    console.error("Signup error:", error);
  }
};

//login
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(500)
        .send({ success: false, message: "Email does not exist" });

    const comparePassword = bcrypt.compareSync(password, user.password || "");
    if (!comparePassword)
      return res
        .status(500)
        .send({ success: false, message: "Incorrect Email or password" });

    const token = jwtToken(user._id, res);

    res.status(200).send({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      profilepic: user.profilepic,
      email: user.email,
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
    console.error("Login error:", error);
  }
};

//logout
export const LogOut = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      path: "/",
      secure: true,
    });
    res.status(200).send({ success: true, message: "Logout successful" });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
    console.error("Logout error:", error);
  }
};
