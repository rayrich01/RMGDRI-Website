#!/usr/bin/env node
/**
 * Create Chloe's profile in Sanity
 * Uploads images and creates the dog document
 */

import { createClient } from '@sanity/client'
import { readFile } from 'fs/promises'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '17o8qiin',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_AUTH_TOKEN,
})

async function uploadImage(imagePath, title) {
  console.log(`📤 Uploading ${title}...`)
  const imageBuffer = await readFile(imagePath)
  const asset = await client.assets.upload('image', imageBuffer, {
    filename: title,
  })
  console.log(`✅ Uploaded ${title}: ${asset._id}`)
  return asset
}

async function createChloe() {
  console.log('🐕 Creating Chloe profile...\n')

  try {
    // Upload hero image
    const heroImage = await uploadImage(
      'public/images/dogs/chloe/hero.jpg',
      'chloe-hero.jpg'
    )

    // Upload gallery images
    const gallery1 = await uploadImage(
      'public/images/dogs/chloe/gallery-1.jpg',
      'chloe-gallery-1.jpg'
    )
    const gallery2 = await uploadImage(
      'public/images/dogs/chloe/gallery-2.jpg',
      'chloe-gallery-2.jpg'
    )

    // Create the dog document
    const chloeDoc = {
      _type: 'dog',
      name: 'Chloe',
      slug: {
        _type: 'slug',
        current: 'chloe',
      },
      breed: 'Great Dane',
      age: '8 months',
      sex: 'female',
      color: 'Brindle',
      weight: 90,
      ears: 'natural',
      status: 'pending',
      featured: true,

      shortDescription: 'Chloe is a sweet 8-month-old Brindle Great Dane who is dog, cat, and kid-friendly. She needs an experienced giant breed adopter who can continue her basic obedience training.',

      description: `Chloe is a gentle and playful 8-month-old Brindle Great Dane who loves being around people and thrives in social environments with kids, dogs, and even cats. While affectionate and eager to please, she's still learning the basics and needs consistent guidance, positive reinforcement, and patience as she grows.

🐶 Personality
Chloe is curious, gentle, and full of puppy energy. She enjoys exploring, playing with toys, and interacting with other animals. At just 8 months old, she's in the full-blown adolescent phase—learning boundaries, testing limits, and soaking up everything her environment teaches her.

She's highly social and tends to do better when there are calm dogs or structured activities to model appropriate behavior. Chloe can become over-excited during play and may need redirection to keep interactions gentle.

🏡 Ideal Home
Chloe is best suited for:
• Experienced giant breed adopters who understand the unique challenges and joys of raising a young, large-breed dog
• Someone comfortable managing a dog still in the puppy/adolescent phase
• A household with structure, consistency, and clear boundaries
• Continued basic obedience training and socialization

Chloe is good with kids, other dogs, and cats, but her size and energy level require management and supervision, especially around small children.

🎓 Training & Behavior
Chloe is house trained and learning crate training. She's working on basic obedience and still developing impulse control, manners, and leash skills. She's eager to learn and responds well to positive reinforcement training methods.

Because she's still a puppy in a giant body, she may jump, mouth, or play too roughly without realizing her size. An experienced adopter committed to ongoing training will help Chloe mature into a well-mannered, reliable companion.

💙 Why Chloe
Chloe represents the joy and challenge of raising a giant breed from puppyhood. She has the potential to be a wonderful family dog, but she needs the right match—someone who understands what it takes to guide a young Great Dane into confident, gentle adulthood.

If you're ready to invest in training, structure, and love, Chloe will reward you with unwavering loyalty, goofy antics, and years of companionship.`,

      goodWith: ['kids', 'dogs', 'cats'],

      specialNeeds: 'Giant Breed Experience Required – Chloe is still in adolescence and needs consistent training, boundaries, and an experienced adopter comfortable managing a large, energetic puppy.',

      medicalNotes: 'Spayed and up to date on vaccinations. No known medical issues.',

      spayedNeutered: true,
      vaccinated: true,
      microchipped: true,

      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: heroImage._id,
        },
      },

      gallery: [
        {
          _key: 'gallery-1',
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: gallery1._id,
          },
          caption: 'Chloe showing her playful side',
        },
        {
          _key: 'gallery-2',
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: gallery2._id,
          },
          caption: 'Sweet Chloe',
        },
      ],
    }

    const result = await client.create(chloeDoc)

    console.log('\n✅ Chloe profile created successfully!')
    console.log(`📄 Document ID: ${result._id}`)
    console.log(`🔗 View at: http://localhost:3000/available-danes/chloe`)
    console.log(`🎨 Edit in Studio: http://localhost:3000/studio/structure/dane;${result._id}`)

  } catch (error) {
    console.error('❌ Error creating Chloe profile:', error)
    process.exit(1)
  }
}

createChloe()
