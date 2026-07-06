import { BaseAccount } from '../schemas';

class Account implements BaseAccount {
  id: string;

  userId: string;
  accountId: string;
  providerId: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  refreshTokenExpiresAt?: Date | null;
  scope?: string | null;
  idToken?: string | null;
  password?: string | null;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(data: BaseAccount) {
    this.id = data.id;

    this.userId = data.userId;
    this.accountId = data.accountId;
    this.providerId = data.providerId;
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
    this.accessTokenExpiresAt = data.accessTokenExpiresAt;
    this.refreshTokenExpiresAt = data.refreshTokenExpiresAt;
    this.scope = data.scope;
    this.idToken = data.idToken;
    this.password = data.password;

    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }
}

export { Account };
