import Repository, { uuid } from '@/lib/repository';
import { MongoClient } from 'mongodb';
import { User } from '@/core/domains/entities/user';
import {
  IUserRepository,
  UserCreate,
  UserUpdate,
} from '@/core/domains/repositories/user';

class UserRepository extends Repository<User> implements IUserRepository {
  constructor(client: MongoClient) {
    super(client, 'users', [
      { key: { email: 1 }, unique: true, name: 'email_unique_index' },
    ]);
  }

  async create(entity: UserCreate): Promise<User> {
    const now = new Date();
    const user = new User({
      ...entity,
      isActive: entity.isActive ?? true,
      isAdmin: entity.isAdmin ?? false,
      isSuperAdmin: entity.isSuperAdmin ?? false,
      id: uuid(),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });

    return super.create(user);
  }

  async update(id: string, entity: UserUpdate): Promise<User> {
    const current = await this.findById(id);
    if (!current) {
      throw new Error('Failed to update entity');
    }

    const user = new User({
      ...current,
      ...entity,
      isActive: entity.isActive ?? current.isActive,
      isAdmin: entity.isAdmin ?? current.isAdmin,
      isSuperAdmin: entity.isSuperAdmin ?? current.isSuperAdmin,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date(),
      deletedAt: current.deletedAt,
    });

    return super.update(id, user);
  }

  protected toEntity(data: User): User {
    return new User(data);
  }
}

export default UserRepository;
