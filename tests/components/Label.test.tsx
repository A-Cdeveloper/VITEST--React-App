import { render, screen } from "@testing-library/react";
import Label from "../../src/components/Label";
import { LanguageProvider } from "../../src/providers/language/LanguageProvider";
import { Language } from "../../src/providers/language/type";

describe("Label", () => {
  const renderComponent = (labelId: string, language: Language = "en") => {
    render(
      <LanguageProvider language={language}>
        <Label labelId={labelId} />
      </LanguageProvider>
    );
  };

  describe("English language", () => {
    it.each([
      { labelId: "welcome", text: "Welcome" },
      { labelId: "new_product", text: "New Product" },
      { labelId: "edit_product", text: "Edit Product" },
    ])("should render $text for $labelId", ({ labelId, text }) => {
      renderComponent(labelId);
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  describe("Spanish language", () => {
    it.each([
      { labelId: "welcome", text: "Bienvenidos" },
      { labelId: "new_product", text: "Nuevo Producto" },
      { labelId: "edit_product", text: "Editar Producto" },
    ])("should render $text for $labelId", ({ labelId, text }) => {
      renderComponent(labelId, "es");
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it.only("should  throw an error if label is invalid", () => {
    // expect(renderComponent("invalid")).toThrowError();

    renderComponent("invalid");
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });
});
