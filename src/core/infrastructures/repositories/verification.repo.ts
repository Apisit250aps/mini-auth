import Repository, { uuid } from '@/lib/repository';
import { MongoClient } from 'mongodb';
import { Verification } from '@/core/domains/entities/verification';
import {
  IVerificationRepository,
  VerificationCreate,
  VerificationUpdate,
} from '@/core/domains/repositories/verification';

class VerificationRepository
  extends Repository<Verification>
  implements IVerificationRepository
{
  constructor(client: MongoClient) {
    super(client, 'verifications', []);
  }

  async create(entity: VerificationCreate): Promise<Verification> {
    const now = new Date();
    const verification = new Verification({
      ...entity,
      id: uuid(),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });

    return super.create(verification);
  }

  async update(id: string, entity: VerificationUpdate): Promise<Verification> {
    const current = await this.findById(id);
    if (!current) {
      throw new Error('Failed to update entity');
    }

    const verification = new Verification({
      ...current,
      ...entity,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date(),
      deletedAt: current.deletedAt,
    });

    return super.update(id, verification);
  }

  protected toEntity(data: Verification): Verification {
    return new Verification(data);
  }
}

export default VerificationRepository;
