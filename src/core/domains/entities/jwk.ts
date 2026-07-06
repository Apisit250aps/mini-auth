import { BaseJwk } from '../schemas';

class Jwk implements BaseJwk {
  id: string;
  publicKey: string;
  privateKey: string;
  expiresAt?: Date | null;
  alg?: string | null;
  crv?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  constructor(data: BaseJwk) {
    this.id = data.id;
    this.publicKey = data.publicKey;
    this.privateKey = data.privateKey;
    this.expiresAt = data.expiresAt;
    this.alg = data.alg;
    this.crv = data.crv;

    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }
}

export { Jwk };
