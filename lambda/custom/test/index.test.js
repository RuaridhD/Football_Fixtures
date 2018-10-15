const virtualAlexa = require("virtual-alexa");
let alexa = null;

beforeAll(() => {
  alexa = virtualAlexa.VirtualAlexa.Builder()
    .handler("./index.handler")
    .interactionModelFile("../../models/en-US.json")
    .create();
});

describe("when the skill is launched", () => {
  let payload;
  beforeEach(async () => {
    payload = await alexa.launch();
  });
  it('should ask "Please choose a country you would like football fixtures for. I have information on the top league in England, Germany, Spain, Italy and Netherlands." when the skill is opened', async () => {
    expect(payload.response.outputSpeech.ssml).toContain(
      "Please choose a country you would like football fixtures for. I have information on the top league in England, Germany, Spain, Italy and Netherlands."
    );
  });
});

describe("and a country name (England) is spoken", () => {
  let payload;
  beforeEach(async () => {
    payload = await alexa.utter("England");
  });
  it("should ask which Premier League matchday I would like fixtures for", async () => {
    expect(payload.response.outputSpeech.ssml).toContain(
      "Which Premier League matchday would you like fixtures for?"
    );
  });
  describe("and a matchday (one) is spoken", () => {
    beforeEach(async () => {
      payload = await alexa.utter("1");
    });
    it("should tell me the matchday fixtures", async () => {
      expect(payload.response.outputSpeech.ssml).toContain(
        "The fixtures for matchday 1 are:"
      );
    });
  });
});
