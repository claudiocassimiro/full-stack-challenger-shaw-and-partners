import { vi } from "vitest";

import { render, screen, cleanup } from "@testing-library/react";

import ListCSV from "..";
const reactMock = require("react");

const setHookState = (newState1: any) =>
  vi.fn().mockImplementation(() => [newState1, () => {}]);
describe(`ListCSV`, () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  describe("When the component is called", () => {
    it("without elements on csvData, should be rendered the UploadCSV component", () => {
      render(<ListCSV />);

      expect(screen.getByText("Add a CSV File")).toBeInTheDocument();
    });

    it("with elemets on csvData, should be rendered the csv data", () => {
      reactMock.useState = setHookState([{ mock: "test" }]);

      render(<ListCSV />);

      expect(screen.queryByText("Add a CSV File")).not.toBeInTheDocument();

      expect(screen.getByText("mock: test")).toBeInTheDocument();
    });
  });
});
