import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RepositoriesListItem from "./RepositoriesListItem";

jest.mock("../tree/FileIcon", () => {
  return () => {
    return "File Icon Component";
  };
});

function renderComponent() {
  const repository = {
    full_name: "facebook/react",
    language: "Javascript",
    description: "a js library",
    owner: "faceook",
    name: "react",
    html_url: "https://github.com/facebook/react",
  };
  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repository} />
    </MemoryRouter>
  );
}

test("必要コンテンツが表示されているか", async () => {
  renderComponent();
  //FileIconをmockする場合はFileIconの描画待ち不要
  // await screen.findByRole("img", { name: "Javascript" });
});
