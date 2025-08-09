import { env } from 'process';
import { HashingService } from 'src/common/services/hashing.service';
import { Role } from 'src/role/entities/role.entity';
import { UserRole } from 'src/role/enums/user-role.enum';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';

export async function runAdminUserSeeder(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const roleRepo = dataSource.getRepository(Role);

  // import hashing service
  const hashingService = new HashingService();

  // Get Admin Role
  const adminRole = await roleRepo.findOne({ where: { name: UserRole.ADMIN } });
  if (!adminRole) {
    console.error('❌ Admin role not found. Please run role seeder first.');
    throw new Error('Admin role not found');
  }

  const adminUser = new User();
  adminUser.username = env.ADMIN_USERNAME || 'Admin';
  adminUser.email = env.ADMIN_EMAIL || '';
  adminUser.password = await hashingService.hashPassword(
    env.ADMIN_PASSWORD || '',
  );
  adminUser.address = env.ADMIN_ADDRESS || '';
  adminUser.phoneNumber = env.ADMIN_PHONE || '';
  adminUser.emailVerified = true;
  adminUser.role = adminRole;

  // Check if admin user already exists
  const existingAdminUser = await userRepo.findOne({
    where: { email: adminUser.email },
  });
  if (!existingAdminUser) {
    await userRepo.save(adminUser);
    console.log('✅ Admin user seeder run successfully!');
    return;
  }
  console.error('❌ Admin user already exists.');
}
