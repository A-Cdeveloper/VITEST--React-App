import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
  it("should render user name", () => {
    const user: User = {
      id: 1,
      name: "Aleksandar",
    };
    render(<UserAccount user={user} />);
    expect(screen.getByText(user.name)).toBeInTheDocument();
  });

  it("should render edit button if user is admin", () => {
    const user: User = {
      id: 1,
      name: "Aleksandar",
      isAdmin: true,
    };
    render(<UserAccount user={user} />);
    const editButton = screen.getByRole("button");
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveTextContent(/edit/i);
  });

  it("should not render edit button if user is not admin", () => {
    const user: User = {
      id: 1,
      name: "Aleksandar",
      isAdmin: false,
    };
    render(<UserAccount user={user} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
