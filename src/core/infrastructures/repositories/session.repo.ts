import Repository, { uuid } from '@/lib/repository';
import { MongoClient } from 'mongodb';
import { Session } from '@/core/domains/entities/session';
import {
  ISessionRepository,
  SessionCreate,
  SessionUpdate,
} from '@/core/domains/repositories/session';

class SessionRepository
  extends Repository<Session>
  implements ISessionRepository
{
  constructor(client: MongoClient) {
    super(client, 'sessions', []);
  }

  async create(entity: SessionCreate): Promise<Session> {
    const now = new Date();
    const session = new Session({
      ...entity,
      id: uuid(),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });

    return super.create(session);
  }

  async update(id: string, entity: SessionUpdate): Promise<Session> {
    const current = await this.findById(id);
    if (!current) {
      throw new Error('Failed to update entity');
    }

    const session = new Session({
      ...current,
      ...entity,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date(),
      deletedAt: current.deletedAt,
    });

    return super.update(id, session);
  }

  protected toEntity(data: Session): Session {
    return new Session(data);
  }
}

export default SessionRepository;
