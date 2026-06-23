import { type DataSource, In } from 'typeorm';
import { type Seeder } from 'typeorm-extension';
import { AnimalBehaviourCategory } from 'src/api/animal-behaviour-category/entities/animal-behaviour-category.entity';
import { AnimalBehaviourSubCategory } from 'src/api/animal-behaviour-sub-category/entities/animal-behaviour-sub-category.entity';
import slugify from 'slugify';

const subCategoriesData = {
  'social-behavior': [
    'Friendly',
    'Very Friendly',
    'Social',
    'Affectionate',
    'Gentle',
    'Loving',
    'People-Friendly',
    'Child-Friendly',
    'Animal-Friendly',
    'Dog-Friendly',
    'Cat-Friendly',
    'Companion-Oriented',
    'Enjoys Company',
    'Independent',
    'Reserved',
    'Aloof',
  ],

  temperament: [
    'Calm',
    'Relaxed',
    'Easygoing',
    'Confident',
    'Balanced',
    'Sensitive',
    'Curious',
    'Alert',
    'Cautious',
    'Timid',
    'Shy',
    'Nervous',
    'Fearful',
    'Emotional',
    'Stubborn',
  ],

  'energy-level': [
    'Low Energy',
    'Moderate Energy',
    'High Energy',
    'Very Active',
    'Hyperactive',
    'Playful',
    'Athletic',
    'Adventurous',
    'Explorative',
    'Outdoor Lover',
    'Indoor Friendly',
  ],

  'intelligence-training': [
    'Intelligent',
    'Quick Learner',
    'Highly Trainable',
    'Obedient',
    'Responsive',
    'Focused',
    'Problem Solver',
    'Food Motivated',
    'Independent Thinker',
    'Easily Distracted',
  ],

  'protective-traits': [
    'Protective',
    'Territorial',
    'Watchful',
    'Loyal',
    'Courageous',
    'Defensive',
    'Guarding Instinct',
    'Protective Of Family',
    'Protective Of Territory',
  ],

  'activity-preferences': [
    'Loves Walking',
    'Loves Running',
    'Loves Swimming',
    'Loves Playing',
    'Loves Fetch',
    'Loves Exploring',
    'Enjoys Training Activities',
    'Enjoys Social Activities',
    'Enjoys Outdoor Activities',
    'Enjoys Indoor Activities',
  ],

  'reproductive-breeding-behavior': [
    'Breeding Ready',
    'Mating Experienced',
    'First-Time Breeder',
    'Social During Introductions',
    'Selective With Partners',
    'Calm Around Potential Mates',
    'Dominant',
    'Submissive',
    'Easily Adapts To New Animals',
    'Breeding Requires Supervision',
  ],

  'behavioral-challenges': [
    'Aggressive',
    'Reactive',
    'Possessive',
    'Resource Guarding',
    'Territorial Aggression',
    'Excessive Vocalization',
    'Destructive Behavior',
    'Separation Anxiety',
    'Overprotective',
    'Dominant Behavior',
    'Impulsive',
    'Easily Stressed',
    'Escapes Frequently',
  ],

  'emotional-traits': [
    'Trusting',
    'Empathetic',
    'Attention Seeking',
    'Emotionally Sensitive',
    'Affection Seeking',
    'Independent Emotionally',
    'Comfort Seeking',
    'Adaptable',
    'Resilient',
  ],

  'special-characteristics': [
    'Therapy Temperament',
    'Emotional Support Temperament',
    'Highly Adaptable',
    'Senior Friendly',
    'Family Friendly',
    'Good With Children',
    'Good With Other Animals',
    'Quiet Nature',
    'Vocal',
    'Curious Nature',
  ],
};

export default class CreateAnimalBehaviourSubCategorySeeder implements Seeder {
  track = false;

  async run(dataSource: DataSource): Promise<void> {
    const categoryRepo = dataSource.getRepository(AnimalBehaviourCategory);
    const subCategoryRepo = dataSource.getRepository(AnimalBehaviourSubCategory);

    // 1. Fetch categories cleanly
    const categories = await categoryRepo.find();
    const categoryMap = new Map(categories.map(category => [category.slug, category]));

    const allSlugs: string[] = [];

    // Filter and build the slugs array, ignoring empty or invalid categories upfront
    for (const [categorySlug, titles] of Object.entries(subCategoriesData)) {
      // IGNORE: If the category slug doesn't exist in the database
      if (!categoryMap.has(categorySlug)) {
        console.warn(`Category slug not found in DB, skipping: ${categorySlug}`);
        continue;
      }

      // IGNORE: If the category does not contain any subcategory titles
      if (!titles || titles.length === 0) {
        console.warn(`Category has no subcategories listed, skipping: ${categorySlug}`);
        continue;
      }

      titles.forEach(item => {
        allSlugs.push(
          slugify(item, {
            lower: true,
            strict: true,
          }),
        );
      });
    }

    // If everything was skipped or no subcategories exist, exit early
    if (allSlugs.length === 0) {
      console.log('No valid subcategories found to process.');
      return;
    }

    // 2. Fetch existing subcategories
    const existingSubCategories = await subCategoryRepo.find({
      where: {
        slug: In(allSlugs),
      },
      relations: {
        category: true,
      },
    });

    const existingMap = new Map(existingSubCategories.map(item => [item.slug, item]));
    const entitiesToSave: AnimalBehaviourSubCategory[] = [];

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const [categorySlug, titles] of Object.entries(subCategoriesData)) {
      const category = categoryMap.get(categorySlug);

      // Double-check skip conditions inside the main loop execution
      if (!category || !titles || titles.length === 0) {
        continue;
      }

      for (const title of titles) {
        const slug = slugify(title, {
          lower: true,
          strict: true,
        });

        const existing = existingMap.get(slug);

        if (!existing) {
          entitiesToSave.push(
            subCategoryRepo.create({
              title,
              slug,
              isActive: true,
              category,
            }),
          );

          created++;
          continue;
        }

        const modified =
          existing.title !== title ||
          existing.category?.abcId !== category.abcId ||
          existing.isActive !== true;

        if (modified) {
          subCategoryRepo.merge(existing, {
            title,
            category,
            isActive: true,
          });

          entitiesToSave.push(existing);
          updated++;
        } else {
          skipped++;
        }
      }
    }

    // 3. Save chunks sequentially to eliminate the pg query collision warning
    if (entitiesToSave.length > 0) {
      await subCategoryRepo.save(entitiesToSave, { chunk: 200 });
    }

    console.log(`Created: ${created}, Updated: ${updated}, Skipped: ${skipped}`);
  }
}
