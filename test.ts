type User = {
  id: number;
  name: string;
  isAdmin?: boolean;
};

type UserId = string | number;

class AccountManager {
  private users: User[];

  constructor() {
    this.users = [];
  }

  public addUser(user: User): void {
    this.users.push(user);
    console.log(`User ${user.name} added.`);
  }

  public findUserById(id: UserId): User | undefined {
    return this.users.find((user) => user.id === id);
  }
}

const manager = new AccountManager();
manager.addUser({ id: 1, name: "Alice", isAdmin: false });
