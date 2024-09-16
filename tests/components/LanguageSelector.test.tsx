import { render, screen } from "@testing-library/react";
import LanguageSelector from "../../src/components/LanguageSelector";
import AllProviders from "../AllProviders";
import { LanguageProvider } from "../../src/providers/language/LanguageProvider";
import { Language } from "../../src/providers/language/type";
import userEvent from "@testing-library/user-event";

describe("LanguageSelector", () => {
  const renderComponent = (language: Language = "en") => {
    const languages: Language[] = ["en", "es"];
    const onChange = vi.fn();

    render(
      <LanguageProvider language={language}>
        <LanguageSelector />
      </LanguageProvider>,
      { wrapper: AllProviders }
    );

    const combobox = screen.getByRole("combobox");
    return {
      combobox,
      languages,
      onChange,
    };
  };

  it("should render EN as default state of selector", () => {
    const { combobox } = renderComponent("en");
    expect(combobox).toHaveTextContent(/en/i);
  });

  it("should render correct list of languages on click selector", async () => {
    const { combobox, languages } = renderComponent();
    const user = userEvent.setup();
    await user.click(combobox);
    const options = screen.getAllByRole("option");
    expect(options.length).toBeGreaterThan(0);

    options.forEach((option, i) => {
      expect(option).toHaveTextContent(RegExp(languages[i], "i"));
    });
  });

  it("should change value on click", async () => {
    const { combobox, languages, onChange } = renderComponent();
    const user = userEvent.setup();
    await user.click(combobox);
    const options = screen.getAllByRole("option");

    options.forEach(async (option, i) => {
      await user.click(option);
      expect(combobox).toHaveTextContent(RegExp(languages[i], "i"));
      expect(onChange).toHaveBeenCalledWith(languages[i]);
    });
  });
});
