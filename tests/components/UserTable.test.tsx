import { render, screen } from "@testing-library/react";
import UserTable from "../../src/components/UserTable";
import { User } from "../../src/entities";
import { db } from "../mocks/db";

describe("UserTable", () => {
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

  it('should render "No users available" if users list is empty', () => {
    render(<UserTable users={[]} />);
    expect(screen.getByText(/no users./i)).toBeInTheDocument();
  });

  it("should render users list if users list is not empty", () => {
    render(<UserTable users={users} />);

    users.forEach((user) => {
      const userLabel = screen.getByRole("cell", { name: user.name });
      expect(userLabel).toBeInTheDocument();
      expect(userLabel).toHaveTextContent(user.name);
    });
  });
});
