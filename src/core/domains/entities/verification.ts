import { BaseVerification } from '../schemas';

class Verification implements BaseVerification {
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  constructor(data: BaseVerification) {
    this.id = data.id;
    this.identifier = data.identifier;
    this.value = data.value;
    this.expiresAt = data.expiresAt;

    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }
}

export { Verification };
