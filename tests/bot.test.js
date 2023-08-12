const fetch = require("node-fetch");
const { respond } = require("../bot"); // Adjust path accordingly

// Mocking dependencies
jest.mock("node-fetch");

jest.mock("../commands/ping", () => ({
  matcher: /^!ping/,
  run: jest.fn(() => Promise.resolve({ text: "pong" })),
}));

describe("respond function", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should execute a matching command and send an HTTP request", async () => {
    fetch.mockResolvedValueOnce({ status: 202 });

    const request = { text: "!ping" };
    await respond(request);

    expect(fetch).toHaveBeenCalledWith(
      "https://api.groupme.com/v3/bots/post",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "pong" }),
      })
    );
  });

  it("should not execute a command if it does not match the matcher", async () => {
    const request = { text: "!ping extra args" }; // assuming !ping command doesn't match with extra args
    await respond(request);

    expect(fetch).not.toHaveBeenCalled();
  });

  it("should not execute a command if no command is found", async () => {
    const request = { text: "!unknown" }; // No command matching '!unknown'
    await respond(request);

    expect(fetch).not.toHaveBeenCalled();
  });
});
