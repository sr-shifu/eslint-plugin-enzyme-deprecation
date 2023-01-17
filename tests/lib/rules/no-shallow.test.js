"use strict";

const rule = require("../../../lib/rules/no-shallow");
const RuleTester = require("eslint").RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: "module",
  ecmaFeatures: {
    jsx: true,
  },
};

const VALID_PATTERNS = [
  'const shallow = () => console.log("HelloWorld!")',
  "import { mount } from 'enzyme';",
  "const { mount } = require('enzyme');",
  "import enzymeApi from 'enzyme';",
  "import * as enzymeApi from 'enzyme';",
  `
    const enzymeApi = require('enzyme');
    it('should render component', () => {
        const wrapper = enzymeApi.mount(<MyReactComp />);
        expect(wrapper.emptyRender()).toBe(true);
    });
  `,
  `
    const { shallow, mount } = require('enzyme');
    it('should render component', () => {
        const wrapper = mount(<MyReactComp />);
        expect(wrapper.emptyRender()).toBe(true);
    });
  `,
  `
    import {shallow, mount} from 'enzyme';
    it('should render component', () => {
        const wrapper = mount(<MyReactComp />);
        expect(wrapper.emptyRender()).toBe(true);
    });
  `,
  `
    const shallow = () => 'test';
    it('should render component', () => {
        const wrapper = shallow(<MyReactComp />);
        expect(wrapper.emptyRender()).toBe(true);
    });
  `,
  `
    import {shallow, mount} from 'not-enzyme';
    it('should render component', () => {
        const wrapper = mount(<MyReactComp />);
        expect(wrapper.emptyRender()).toBe(true);
    });
  `,
];

const INVALID_PATTERNS = [
  `
      const enzymeApi = require('enzyme');
      it('should render component', () => {
          const wrapper = enzymeApi.shallow(<MyReactComp />);
          expect(wrapper.emptyRender()).toBe(true);
      });
    `,
  `
      const { shallow } = require('enzyme');
      it('should render component', () => {
          const wrapper = shallow(<MyReactComp />);
          expect(wrapper.emptyRender()).toBe(true);
      });
    `,
  `
      const { shallow, mount } = require('enzyme');
      it('should render component', () => {
          const wrapper = shallow(<MyReactComp />);
          expect(wrapper.emptyRender()).toBe(true);
      });
    `,
  `
      import {shallow} from 'enzyme';
      it('should render component', () => {
          const wrapper = shallow(<MyReactComp />);
          expect(wrapper.emptyRender()).toBe(true);
      });
    `,
  `
      import {shallow, mount} from 'enzyme';
      it('should render component', () => {
          const wrapper = shallow(<MyReactComp />);
          expect(wrapper.emptyRender()).toBe(true);
      });
    `,
  `
      import * as enzymeApi from 'enzyme';
      it('should render component', () => {
          const wrapper = enzymeApi.shallow(<MyReactComp />);
          expect(wrapper.emptyRender()).toBe(true);
      });
    `,
  `
      import enzymeApi from 'enzyme';
      it('should render component', () => {
          const wrapper = enzymeApi.shallow(<MyReactComp />);
          expect(wrapper.emptyRender()).toBe(true);
      });
    `,
];

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run("no-shallow", rule, {
  valid: VALID_PATTERNS.map((pattern) => ({ code: pattern })),

  invalid: INVALID_PATTERNS.map((pattern) => ({
    code: pattern,
    errors: [{ messageId: "noShallowCall" }],
  })),
});

ruleTester.run("no-shallow", rule, {
  valid: [
    `
      // defined in global scope outside of this module
      // global.shallow = require('enzyme').shallow;
      it('should render component', () => {
          const wrapper = shallow(<MyReactComp />);
          expect(wrapper.emptyRender()).toBe(true);
      });
    `,
  ].map((pattern) => ({
    code: pattern,
    options: [{ implicitlyGlobal: false }],
  })),
  invalid: [
    `
      // defined in global scope outside of this module
      // global.shallow = require('enzyme').shallow;
      it('should render component', () => {
          const wrapper = shallow(<MyReactComp />);
          expect(wrapper.emptyRender()).toBe(true);
      });
    `,
  ].map((pattern) => ({
    code: pattern,
    options: [{ implicitlyGlobal: true }],
    errors: [{ messageId: "noShallowCall" }],
  })),
});

ruleTester.run("no-shallow", rule, {
  valid: VALID_PATTERNS.concat(
    ...VALID_PATTERNS.map((code) =>
      code
        .replace(/\bshallow\b/g, "shallowWithReduxState")
        .replace(/\benzyme\b/, "@testUtils")
    )
  ).map((pattern) => ({
    code: pattern,
    options: [
      {
        resolveAs: [
          {
            name: "shallowWithReduxState",
            sources: ["^@test-utils"],
          },
        ],
      },
    ],
  })),

  invalid: INVALID_PATTERNS.concat(
    ...INVALID_PATTERNS.map((code) =>
      code
        .replace(/\bshallow\b/g, "shallowWithReduxState")
        .replace(/\benzyme\b/, "@testUtils")
    )
  ).map((pattern) => ({
    code: pattern,
    options: [
      {
        resolveAs: [
          {
            name: "shallowWithReduxState",
            sources: ["^@testUtils"],
          },
        ],
      },
    ],
    errors: [{ messageId: "noShallowCall" }],
  })),
});
