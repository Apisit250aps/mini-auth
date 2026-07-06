import Repository, { uuid } from '@/lib/repository';
import { MongoClient } from 'mongodb';
import { Jwk } from '@/core/domains/entities/jwk';
import {
  IJwkRepository,
  JwkCreate,
  JwkUpdate,
} from '@/core/domains/repositories/jwk';

class JwkRepository extends Repository<Jwk> implements IJwkRepository {
  constructor(client: MongoClient) {
    super(client, 'jwks', []);
  }

  async create(entity: JwkCreate): Promise<Jwk> {
    const now = new Date();
    const jwk = new Jwk({
      ...entity,
      id: uuid(),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });

    return super.create(jwk);
  }

  async update(id: string, entity: JwkUpdate): Promise<Jwk> {
    const current = await this.findById(id);
    if (!current) {
      throw new Error('Failed to update entity');
    }

    const jwk = new Jwk({
      ...current,
      ...entity,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date(),
      deletedAt: current.deletedAt,
    });

    return super.update(id, jwk);
  }

  protected toEntity(data: Jwk): Jwk {
    return new Jwk(data);
  }
}

export default JwkRepository;
