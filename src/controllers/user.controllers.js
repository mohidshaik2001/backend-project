import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResonse } from "../utils/ApiResponse.utils.js";
import { generateTokens } from "../utils/generateTokens.utils.js";
import jwt from "jsonwebtoken";
import {
  encryptPassword,
  isPasswordMatch,
} from "../utils/passwordEncryptDecrypt.utils.js";
import { findUserById } from "../models/user.models.js";
import db from "../db/index.js";

const userRegister = asyncHandler(async (req, res) => {
  try {
    if (!req.body) {
      throw new ApiError(400, "req body error");
    }
    //console.log("req body", req.body);

    const { fullname, username, email, password } = req.body;

    //console.log(`${fullname} ${username} ${email} ${password}`);

    if (
      [username, fullname, email, password].some((field) => {
        field?.trim() === "";
      })
    ) {
      throw new ApiError(400, "all fields are required");
    }
    const [existedUser] = await db.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );
    //console.log(existedUser);
    if (existedUser.length > 0) {
      throw new ApiError(409, "username or email already exists");
    }
    const passwordHash = await encryptPassword(password);
    const [{ insertId }] = await db.query(
      "INSERT INTO users (username, fullname, email, password) VALUES (?, ?, ?, ?)",
      [username, fullname, email, passwordHash]
    );
    //console.log("insertId\n", insertId);
    if (!insertId) {
      throw new ApiError(500, "Error at server insertion ");
    }

    const [user] = await db
      .query("Select * from users where id = ?", [insertId])
      .then((result) => {
        return result[0];
      });
    console.log("user", user);
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .json(
        new ApiResonse(
          200,
          { ...user, password: undefined, refreshToken: undefined },
          "user registered successfully"
        )
      );
  } catch (error) {
    console.error(error);
  }
});

const userLogin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  console.log("req body", req.body);

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }
  const query = "SELECT * FROM users WHERE username = ? OR email = ?";
  const [user] = await db
    .query(query, [username || email, username || email])
    .then((result) => {
      return result[0];
    });
  console.log("user", user.password);
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  console.log("user", user);
  const isMatch = await isPasswordMatch(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "password is incorrect");
  }
  const { accessToken, refreshToken } = generateTokens({ id: user.id });
  const query2 = "UPDATE users SET refreshToken = ? WHERE id = ?";
  await db.query(query2, [refreshToken, user.id]);

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResonse(
        200,
        {
          ...user,
          password: undefined,
          refreshToken: undefined,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
        "user logged in successfully"
      )
    );
});

const userLogout = asyncHandler(async (req, res) => {
  console.log(req.user);
  const query = "update users set refreshToken = null where id = ?";
  const [{ affectedRows }] = await db.query(query, [req.user.id]);
  if (affectedRows === 0) {
    throw new ApiError(404, "user not found");
  }
  res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResonse(200, null, "user logged out successfully"));
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  console.log("refreshToken", refreshToken);
  if (!refreshToken) {
    throw new ApiError(401, "unauthoried request");
  }
  const decodedToken = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  console.log("decodedToken", decodedToken);

  if (!decodedToken) {
    throw new ApiError(401, "unauthoried request");
  }
  const user = await findUserById(decodedToken.id);
  console.log("user", user);

  if (!user) {
    throw new ApiError(401, "unauthoried request");
  }
  if (user.refreshToken !== refreshToken) {
    throw new ApiError(401, "unauthoried request");
  }
  const accessToken = jwt.sign(
    { id: decodedToken.id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    }
  );

  res
    .status(200)
    .cookie("accessToken", accessToken)
    .json(new ApiResonse(200, { accessToken }, "token refreshed successfully"));
});
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.id);
  // console.log("user in current controller", user);
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  res.status(200).json(new ApiResonse(200, user, "user found successfully"));
});

export {
  userRegister,
  userLogin,
  userLogout,
  refreshAccessToken,
  getCurrentUser,
};
