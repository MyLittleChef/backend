import { Repository, EntityRepository } from 'typeorm';
import { Recette } from './entities/recette.entity';

@EntityRepository(Recette)
export class UserRepository extends Repository<Recette> {}