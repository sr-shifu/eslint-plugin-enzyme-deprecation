const { shallow, mount } = require("enzyme");

describe("component test", () => {
  it("should shallow render", () => {
    expect(shallow(<div />)).toMatchSnapshot();
  });

  it("should deep render", () => {
    expect(mount(<div />)).toMatchSnapshot();
  });
});
