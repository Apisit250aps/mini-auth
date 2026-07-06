import type { BaseRepository } from '@/lib/repository';
import type { Session } from '../entities/session';
import type {
  CreateSessionSchema as SessionCreate,
  UpdateSessionSchema as SessionUpdate,
} from '../schemas';

type ISessionRepository = BaseRepository<Session, SessionCreate, SessionUpdate>;

export type { ISessionRepository, SessionCreate, SessionUpdate };
