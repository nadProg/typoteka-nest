import { Repository } from 'typeorm';

export const resetRepository = async (
  repository: Repository<any>,
  name: string,
): Promise<void> => {
  await repository.query(`DELETE FROM ${name}`);
  await repository.query(`DELETE FROM sqlite_sequence WHERE name='${name}';`);
};
