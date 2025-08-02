import bycrpt from "bcrypt";

const encryptPassword = async (password) => {
  const salt = await bycrpt.genSalt(10);
  const hash = await bycrpt.hash(password, salt);
  return hash;
};

const isPasswordMatch = async (password, hash) => {
  const isMatch = await bycrpt.compare(password, hash);
  return isMatch;
};

export { encryptPassword, isPasswordMatch };
