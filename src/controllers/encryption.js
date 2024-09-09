const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cryptoJS = require("crypto-js");
const cryptography = require("cryptography");

const JWT_SECRET = process.env.JWT_SECRET;

// function based on json web token

const getUsersjson = async (req, res) => {
  try {
    const users = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    const token = jwt.sign({ users }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (token || decoded) {
      return res.status(200).json({ token: token, decoded: decoded });
    }
    return res.status(404).json({ error: "data not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// the function based on becrypt js

const getAllUsersbcrypt = async (req, res) => {
  try {
    const users = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    var encdata = await bcrypt.hash(JSON.stringify(users?.email), 10);
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    if (encdata) {
      return res.status(200).json({ encdata: encdata, email: users?.email });
    }
    return res.status(404).json({ error: "data not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// based on cryptojs

const getAllUserscrypto = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    var encdata = cryptoJS.AES.encrypt(
      JSON.stringify(users),
      process.env.CRYPTO_JS_KEY
    ).toString();
    // in this field the method allow for strings so pass string
    const decdata = cryptoJS.AES.decrypt(encdata, process.env.CRYPTO_JS_KEY);
    const reldata = JSON.parse(decdata.toString(cryptoJS.enc.Utf8));

    if (encdata || reldata) {
      return res.status(200).json({ encdata: encdata, decdata: reldata });
    }
    return res.status(404).json({ error: "data not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// encryption and decryption with cryptography

cryptography.defaults.key = process.env.CRYPTOGRAPHY_KEY;
cryptography.defaults.encryptionAlgorithm = process.env.CRYPTOGRAPHY_ALGORITHM;
cryptography.defaults.encoding = process.env.CRYPTOGRAPHY_ENCODING;
const encryptUserData = async (userData) => {
  return Promise.all(
    userData.map(async (item) => {
      try {
        const encryptedUser = {
          id: item.id,
          createdAt: item.createdAt,
          email: await cryptography.encrypt({
            data: item.email,
          }),
          name: await cryptography.encrypt({
            // it is not secret key ,original secret key in .env file
            // key:"dfakdfhdkfhgh",
            // algorithm: "aes127",
            // encoding: "dec"
            data: item.name,
          }),
        };
        return encryptedUser;
      } catch (error) {
        console.error("Encryption error:", error);
        return null;
      }
    })
  );
};

const decryptUserData = async (userData) => {
  return Promise.all(
    userData.map(async (item) => {
      try {
        const decryptedUser = {
          id: item.id,
          createdAt: item.createdAt,
          email: await cryptography.decrypt({
            data: item.email,
          }),
          name: await cryptography.decrypt({
            // it is not secret key ,original secret key in .env file
            // key:"dfakdfhdkfhgh",
            // algorithm: "aes127",
            // encoding: "dec"
            data: item.name,
          }),
        };
        return decryptedUser;
      } catch (error) {
        console.error("Decryption error:", error);
        return null;
      }
    })
  );
};

const getAllUserscryptography = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    const encryptedData = await encryptUserData(users);
    const decryptedUsers = await decryptUserData(encryptedData);

    return res
      .status(200)
      .json({ encdata: encryptedData, decdata: decryptedUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsersjson,
  getAllUserscrypto,
  getAllUsersbcrypt,
  getAllUserscryptography,
};
