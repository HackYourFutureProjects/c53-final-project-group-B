export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.(jpg|jpeg|png|svg|lottie)$": "<rootDir>/__mocks__/fileMock.js",
    "^@lottiefiles/dotlottie-react$": "<rootDir>/__mocks__/dotlottieMock.js",
  },
};
