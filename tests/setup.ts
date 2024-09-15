import "@testing-library/jest-dom/vitest";
import ResizeObserver from "resize-observer-polyfill";
import { server } from "./mocks/server";

import { PropsWithChildren } from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

global.ResizeObserver = ResizeObserver;

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();

vi.mock("@auth0//auth0-react", () => {
  return {
    useAuth0: vi.fn().mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: undefined,
    }),
    Auth0Provider: ({ children }: PropsWithChildren) => children,
    withAuthenticationRequired: (component: React.ReactNode) => {
      return component as React.ReactElement;
    },
  };
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
