import { Repository } from 'typeorm';
import { resetRepository } from '../../helpers/reset-repository';

export const resetDataset = ({
  commentsRepository,
}: {
  commentsRepository: Repository<any>;
}): Promise<void> => resetRepository(commentsRepository, 'comments');
