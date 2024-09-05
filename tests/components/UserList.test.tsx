import { render, screen } from "@testing-library/react";
import UserList from "../../src/components/UserList";
import { User } from "../../src/entities";

describe("UserList", () => {
  const users: User[] = [
    {
      id: 1,
      name: "Aleksandar",
    },
    {
      id: 2,
      name: "Biljana",
    },
  ];

  it('should render "No users available" if users list is empty', () => {
    render(<UserList users={[]} />);
    expect(screen.getByText(/no users./i)).toBeInTheDocument();
  });

  it("should render users list if users list is not empty", () => {
    render(<UserList users={users} />);

    users.forEach((user) => {
      const link = screen.getByRole("link", { name: user.name });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", `/users/${user.id}`);
    });
  });
});
