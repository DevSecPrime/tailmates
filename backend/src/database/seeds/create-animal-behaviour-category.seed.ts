import { type DataSource, In } from 'typeorm';
import type { Seeder } from 'typeorm-extension';
import { AnimalBehaviourCategory } from 'src/api/animal-behaviour-category/entities/animal-behaviour-category.entity';

export default class CreateAnimalBehaviourCategorySeeder implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(AnimalBehaviourCategory);

    // 1. The comprehensive master dataset
    const categoriesData = [
      {
        title: 'Social Behavior',
        slug: 'social-behavior',
        description: 'Social interaction tendencies of the animal',
        isActive: true,
      },
      {
        title: 'Temperament',
        slug: 'temperament',
        description: 'General mood, nature, and personality traits',
        isActive: true,
      },
      {
        title: 'Energy Level',
        slug: 'energy-level',
        description: 'Activity, endurance, and physical drive levels',
        isActive: true,
      },
      {
        title: 'Intelligence & Training',
        slug: 'intelligence-training',
        description: 'Cognitive capabilities, trainability, and responsiveness',
        isActive: true,
      },
      {
        title: 'Protective Traits',
        slug: 'protective-traits',
        description: 'Guarding, loyalty, and territorial tendencies',
        isActive: true,
      },
      {
        title: 'Activity Preferences',
        slug: 'activity-preferences',
        description: 'Favorite physical tasks, sports, and routines',
        isActive: true,
      },
      {
        title: 'Reproductive & Breeding Behavior',
        slug: 'reproductive-breeding-behavior',
        description: 'Mating traits, readiness, and behavior around potential partners',

        isActive: true,
      },
      {
        title: 'Behavioral Challenges',
        slug: 'behavioral-challenges',
        description: 'Potential behavioral issues, aggression, or anxieties',
        isActive: true,
      },
      {
        title: 'Emotional Traits',
        slug: 'emotional-traits',
        description: 'Emotional sensitivities, bonding, and coping mechanisms',
        isActive: true,
      },
      {
        title: 'Special Characteristics',
        slug: 'special-characteristics',
        description: 'Unique assignments like support, therapy status, or multi-age friendliness',
        isActive: true,
      },
    ];

    // 2. Extract all slugs to query everything at once
    const slugs = categoriesData.map(c => c.slug);

    // 3. SINGLE QUERY: Fetch all matching categories currently in the database
    const existingCategories = await repository.find({
      where: { slug: In(slugs) },
    });

    // 4. Create an in-memory HashMap/Map lookup for O(1) checks
    const categoryMap = new Map<string, AnimalBehaviourCategory>();
    existingCategories.forEach(category => {
      categoryMap.set(category.slug, category);
    });

    const entitiesToSave: AnimalBehaviourCategory[] = [];
    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    // 5. Loop entirely in-memory (No database queries inside this loop)
    for (const data of categoriesData) {
      const existingCategory = categoryMap.get(data.slug);

      if (!existingCategory) {
        // Prepare new entity for bulk insertion
        entitiesToSave.push(repository.create(data));
        insertedCount++;
      } else {
        // Check if an update is strictly necessary
        const isModified =
          existingCategory.title !== data.title ||
          existingCategory.description !== data.description ||
          existingCategory.isActive !== data.isActive;

        if (isModified) {
          // Merge updates into entity instance for bulk save
          repository.merge(existingCategory, data);
          entitiesToSave.push(existingCategory);
          updatedCount++;
        } else {
          skippedCount++;
        }
      }
    }

    // 6. BULK SAVE: Send everything to the database in batches/single transaction if changes exist
    if (entitiesToSave.length > 0) {
      await repository.save(entitiesToSave);
    }

    console.warn('--- Optimized AnimalBehaviourCategory Seeding Report ---');
    console.log(
      `🌱 Created: ${insertedCount} | 🔄 Updated: ${updatedCount} | 💤 Skipped: ${skippedCount}`,
    );
    console.log('✅ Database seeding execution complete.');
  }
}
