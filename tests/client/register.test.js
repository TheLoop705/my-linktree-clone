import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SessionProvider } from "next-auth/react";
import RegisterPage from "@/app/register/page";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock fetch for API calls
global.fetch = jest.fn();

const MockSessionProvider = ({ children }) => {
  return <SessionProvider session={null}>{children}</SessionProvider>;
};

describe("RegisterPage", () => {
  beforeEach(() => {
    fetch.mockClear();
    mockPush.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders registration form", () => {
    render(
      <MockSessionProvider>
        <RegisterPage />
      </MockSessionProvider>
    );

    expect(
      screen.getByRole("heading", { name: /register/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
  });

  it("shows validation errors for invalid input", async () => {
    const user = userEvent.setup();

    render(
      <MockSessionProvider>
        <RegisterPage />
      </MockSessionProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /register/i });

    // Enter invalid data
    await user.type(emailInput, "invalid-email");
    await user.type(passwordInput, "weak");
    await user.click(submitButton);

    // Should show client-side validation errors
    await waitFor(() => {
      expect(emailInput).toHaveClass("border-red-500"); // or whatever error class you use
    });
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();

    // Mock successful registration response
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        success: true,
        message: "User registered successfully",
      }),
    });

    render(
      <MockSessionProvider>
        <RegisterPage />
      </MockSessionProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /register/i });

    // Enter valid data
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "ValidPassword123");
    await user.click(submitButton);

    // Should call API
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          password: "ValidPassword123",
        }),
      });
    });
  });

  it("displays API validation errors", async () => {
    const user = userEvent.setup();

    // Mock API error response
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        success: false,
        errors: {
          email: ["Email already exists"],
          password: ["Password must contain at least one uppercase letter"],
        },
      }),
    });

    render(
      <MockSessionProvider>
        <RegisterPage />
      </MockSessionProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /register/i });

    await user.type(emailInput, "existing@example.com");
    await user.type(passwordInput, "testpassword123");
    await user.click(submitButton);

    // Should display API errors
    await waitFor(() => {
      expect(screen.getByText("Email already exists")).toBeInTheDocument();
      expect(
        screen.getByText("Password must contain at least one uppercase letter")
      ).toBeInTheDocument();
    });
  });

  it("redirects to login on successful registration", async () => {
    const user = userEvent.setup();

    // Mock successful registration
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        success: true,
        message: "User registered successfully",
      }),
    });

    render(
      <MockSessionProvider>
        <RegisterPage />
      </MockSessionProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /register/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "ValidPassword123");
    await user.click(submitButton);

    // Should redirect to login
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("shows loading state during form submission", async () => {
    const user = userEvent.setup();

    // Mock slow API response
    fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                status: 201,
                json: async () => ({ success: true }),
              }),
            100
          )
        )
    );

    render(
      <MockSessionProvider>
        <RegisterPage />
      </MockSessionProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /register/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "ValidPassword123");
    await user.click(submitButton);

    // Should show loading state
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/registering/i)).toBeInTheDocument();
  });

  it("shows password requirements hint", () => {
    render(
      <MockSessionProvider>
        <RegisterPage />
      </MockSessionProvider>
    );

    expect(screen.getByText(/8 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/uppercase/i)).toBeInTheDocument();
    expect(screen.getByText(/lowercase/i)).toBeInTheDocument();
    expect(screen.getByText(/number/i)).toBeInTheDocument();
  });

  it("has link to login page", () => {
    render(
      <MockSessionProvider>
        <RegisterPage />
      </MockSessionProvider>
    );

    const loginLink = screen.getByRole("link", { name: /sign in/i });
    expect(loginLink).toHaveAttribute("href", "/login");
  });
});
