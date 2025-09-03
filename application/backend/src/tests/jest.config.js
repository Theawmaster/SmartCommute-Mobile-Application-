import dotenv from 'dotenv';
dotenv.config();

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  setupFiles: ["<rootDir>/jest.setup.js"],
};