import { render, screen } from "@testing-library/react";
import UserList from "../../src/components/UserList";
import { User } from "../../src/entities";
import { db } from "../mocks/db";

describe("UserList", () => {
  const users: User[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach((i) => {
      users.push(db.users.create());
    });
  });

  afterAll(() => {
    db.users.deleteMany({
      where: {
        id: {
          in: users.map((user) => user.id),
        },
      },
    });
  });

  it.only('should render "No users available" if users list is empty', () => {
    render(<UserList users={[]} />);
    expect(screen.getByText(/no users./i)).toBeInTheDocument();
  });

  it.only("should render users list if users list is not empty", () => {
    render(<UserList users={users} />);

    users.forEach((user) => {
      const link = screen.getByRole("link", { name: user.name });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", `/users/${user.id}`);
    });
  });
});
