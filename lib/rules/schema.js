module.exports = [
  {
    type: "object",
    properties: {
      implicitlyGlobal: {
        type: "boolean",
      },
      resolveAs: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            sources: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
          required: ["name"],
          additionalProperties: false,
        },
      },
    },
    additionalProperties: false,
  },
];
