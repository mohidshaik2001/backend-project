import db from "../db/index.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.utils.js";

export const authUser = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    // console.log("client accesstoken", token);
    if (!token) {
      throw new ApiError(403, "No accesstoken");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) {
      throw new ApiError(403, "Unauthorized request");
    }
    // console.log("decodedToken", decodedToken);
    const id = decodedToken.id;
    const [user] = await db.query("select * from users where id = ?", [id]);
    // console.log("user from db", user);
    if (!user.length > 0) {
      throw new ApiError(403, "Unauthorized request");
    }
    req.user = user[0];
    next();
  } catch (error) {
    throw new ApiError(403, "Unauthorized request");
  }
};
