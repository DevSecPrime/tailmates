import type { DataSource } from 'typeorm';
import type { Seeder } from 'typeorm-extension';
import { User } from 'src/api/user/entities/user.entity';
import { AdminRoles, UserRoles } from 'src/constants/user.constant';
import { encodePassword } from 'src/helpers/bcrypt.helper';
import { generateUniqueId } from 'src/helpers/utils.helper';

export default class CreateAdminSeeder implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(User);

    const adminUsers = [
      {
        email: 'admin@studioera.com',
        role: UserRoles.ADMIN,
        adminRole: AdminRoles.ADMIN,
        password: 'oT9(5M{U3q]zani',
      },
      {
        email: 'suparadmin@studioera.com',
        role: UserRoles.ADMIN,
        adminRole: AdminRoles.SUPER_ADMIN,
        password: 'Y7gEc7{VEp8y74T',
      },
      {
        email: 'user@studioera.com',
        role: UserRoles.USER,
        password: 'oT9(5M{U3q]acos',
      },
    ];

    for (const userData of adminUsers) {
      const existingUser = await repository.findOne({ where: { email: userData.email } });

      if (!existingUser) {
        await repository.save(
          repository.create({
            ...userData,
            uid: generateUniqueId('U'),
            verifiedAt: new Date(),
            password: encodePassword(userData.password),
          }),
        );
        console.log(`✅ User created: ${userData.email}`);
      } else {
        console.log(`⚠️ User already exists: ${userData.email}, skipping...`);
      }
    }

    console.log('✅ Database seeding completed.');
  }
}
