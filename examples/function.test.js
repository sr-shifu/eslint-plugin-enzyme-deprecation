const functionUnderTest = () => ({ test: 1 });

describe("component test", () => {
  it("should call function under test", () => {
    expect(functionUnderTest()).toMatchSnapshot();
  });
});
