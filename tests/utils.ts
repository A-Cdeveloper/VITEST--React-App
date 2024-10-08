import { User, useAuth0 } from "@auth0/auth0-react";
import { HttpResponse, delay, http } from "msw";
import { server } from "./mocks/server";

export const simulateDelay = (endpoint: string) => {
  server.use(
    http.get(`/${endpoint}`, async () => {
      await delay();
      return HttpResponse.json([]);
    })
  );
};

export const simulateError = (endpoint: string) => {
  server.use(
    http.get(`/${endpoint}`, async () => {
      return HttpResponse.error();
    })
  );
};

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | undefined;
};

export const mockAuthState = (authState: AuthState) => {
  const logMockFn = vi.fn();

  vi.mocked(useAuth0).mockReturnValue({
    ...authState,
    getAccessTokenSilently: vi.fn(),
    getAccessTokenWithPopup: vi.fn(),
    getIdTokenClaims: vi.fn(),
    loginWithRedirect: logMockFn,
    loginWithPopup: vi.fn(),
    logout: logMockFn,
    handleRedirectCallback: vi.fn(),
  });
  return { ...authState, logMockFn };
};
