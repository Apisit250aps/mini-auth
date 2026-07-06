import Repository, { uuid } from '@/lib/repository';
import { MongoClient } from 'mongodb';
import { Account } from '@/core/domains/entities/account';
import {
  IAccountRepository,
  AccountCreate,
  AccountUpdate,
} from '@/core/domains/repositories/account';

class AccountRepository
  extends Repository<Account>
  implements IAccountRepository
{
  constructor(client: MongoClient) {
    super(client, 'accounts', []);
  }

  async create(entity: AccountCreate): Promise<Account> {
    const now = new Date();
    const account = new Account({
      ...entity,
      id: uuid(),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });

    return super.create(account);
  }

  async update(id: string, entity: AccountUpdate): Promise<Account> {
    const current = await this.findById(id);
    if (!current) {
      throw new Error('Failed to update entity');
    }

    const account = new Account({
      ...current,
      ...entity,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date(),
      deletedAt: current.deletedAt,
    });

    return super.update(id, account);
  }

  protected toEntity(data: Account): Account {
    return new Account(data);
  }
}

export default AccountRepository;
