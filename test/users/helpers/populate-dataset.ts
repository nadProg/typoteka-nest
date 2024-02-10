import { Repository } from 'typeorm';
import { User } from '../../../src/users/entities/user.entity';
import { mockCreateUserDtos } from './mock-create-user-dtos';

export const populateDataset = async ({
  usersRepository,
}: {
  usersRepository: Repository<User>;
}): Promise<void> => {
  await usersRepository.save(
    mockCreateUserDtos.map((createUserDto) => ({
      ...createUserDto,
      passwordHash: createUserDto.password,
    })),
  );
};
