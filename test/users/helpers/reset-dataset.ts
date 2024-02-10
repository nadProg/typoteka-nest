import { Repository } from 'typeorm';
import { resetRepository } from '../../helpers/reset-repository';

export const resetDataset = ({
  usersRepository,
}: {
  usersRepository: Repository<any>;
}): Promise<void> => resetRepository(usersRepository, 'users');
