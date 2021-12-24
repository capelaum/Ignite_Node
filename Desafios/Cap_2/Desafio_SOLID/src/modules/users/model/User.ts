import { randomUUID } from "crypto";

class User {
  id: string;
  name: string;
  admin: boolean;
  email: string;
  created_at: Date;
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = randomUUID();
      this.admin = false;
    }
  }
}

export { User };
