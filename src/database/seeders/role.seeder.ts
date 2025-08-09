import { Role } from 'src/role/entities/role.entity';
import { UserRole } from 'src/role/enums/user-role.enum';
import { DataSource } from 'typeorm';

export async function runRoleSeeder(dataSource: DataSource) {
  const roleRepo = dataSource.getRepository(Role);
  const roles = [
    { name: UserRole.ADMIN },
    { name: UserRole.INSTRUCTOR },
    { name: UserRole.STUDENT },
  ];
  for (const role of roles) {
    const exists = await roleRepo.findOne({ where: { name: role.name } });
    if (!exists) {
      await roleRepo.save(roleRepo.create(role));
    }
  }
  console.log('Role seeder run successfully!');
}
