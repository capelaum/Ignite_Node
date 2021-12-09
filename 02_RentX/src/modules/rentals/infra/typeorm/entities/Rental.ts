import { randomUUID } from "crypto";

class Rental {
  id: string;

  car_id: string;

  user_id: string;

  start_date: Date;

  end_date: Date;

  expected_return_date: Date;

  total: number;

  created_at: Date;

  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = randomUUID();
      this.created_at = new Date();
    }
  }
}

export { Rental };