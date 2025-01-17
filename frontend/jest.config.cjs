module.exports = {
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    testEnvironment: "jsdom",
    setupFiles: ["./jest.setup.js"],
};
