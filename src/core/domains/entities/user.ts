import { BaseUser } from '../schemas';

class User implements BaseUser {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean | null;
  image?: string | null;
  //
  firstName?: string | null;
  lastName?: string | null;
  nickname?: string | null;
  birthday?: string | null;
  //
  isActive: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;

  // timestamps
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  lastLoginAt?: Date | null;

  constructor(data: BaseUser) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.emailVerified = data.emailVerified;
    this.image = data.image;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.nickname = data.nickname;
    this.birthday = data.birthday;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
    this.lastLoginAt = data.lastLoginAt;
    this.isActive = data.isActive ?? true;
    this.isAdmin = data.isAdmin ?? false;
    this.isSuperAdmin = data.isSuperAdmin ?? false;
  }

  age(): number | null {
    if (!this.birthday) return null;
    const birthDate = new Date(this.birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }
}

export { User };
