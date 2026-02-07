#!/usr/bin/env node
/**
 * Create Chevy's profile in Sanity
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

async function createChevy() {
  console.log('🐕 Creating Chevy profile...\n')

  try {
    // Upload hero image
    const heroImage = await uploadImage(
      'public/images/dogs/chevy/hero.jpg',
      'chevy-hero.jpg'
    )

    // Upload gallery images
    const gallery1 = await uploadImage(
      'public/images/dogs/chevy/gallery-1.jpg',
      'chevy-gallery-1.jpg'
    )
    const gallery2 = await uploadImage(
      'public/images/dogs/chevy/gallery-2.jpg',
      'chevy-gallery-2.jpg'
    )
    const gallery3 = await uploadImage(
      'public/images/dogs/chevy/gallery-3.jpg',
      'chevy-gallery-3.jpg'
    )

    // Create the dog document
    const chevyDoc = {
      _type: 'dog',
      name: 'Chevy',
      slug: {
        _type: 'slug',
        current: 'chevy',
      },
      breed: 'Great Dane',
      age: '5 years',
      sex: 'female',
      color: 'Merle',
      weight: 108,
      ears: 'natural',
      status: 'available',
      featured: true,

      shortDescription: 'Chevy is a sensitive, soulful 5-year-old Merle Great Dane who has made meaningful strides through professional training. She needs a calm, experienced home with no other pets and adults only.',

      description: `Meet Chevy — the sweetest girl with a tender heart, a playful soul, and a story shaped by resilience. At 5 years old, Chevy has made meaningful strides through professional training and is now searching for a calm, experienced family ready to continue her journey with patience and understanding.

💙 Personality
Chevy is a sensitive, soulful Great Dane with a gentle heart and a playful, goofy side that shines once she feels safe. Her story is one of resilience, growth, and quiet bravery – and she's looking for a calm, patient home that will continue supporting her journey.

Chevy thrives on routine and structure. New people, sudden movements, loud noises, and unfamiliar environments can feel overwhelming at first, and she needs time and thoughtful introductions to build trust. But once that trust is earned, Chevy transforms into an affectionate Velcro Dane who adores snuggles, belly rubs, couch time, and following her people from room to room. She's curious, endearing, and not shy about nudging a hand when she wants affection.

At home with her trusted people, Chevy is a total goofball – rolling in the grass, doing joyful zoomies, chewing on her favorite toys, and proudly flopping onto her back for attention. She sleeps in bed, loves treats, and finds comfort in predictable daily routines.

💛 Training & Progress
Chevy is house trained, crate trained, and knows her basics including sit, down, come, stay, and off. She walks well on leash but may pull when excited. She is intelligent, food-motivated, and eager to learn, especially in calm, structured environments where expectations are clear.

Fear and anxiety are Chevy's biggest challenges, particularly around unfamiliar people and dogs. With professional training support, she has shown encouraging progress – remaining calm and neutral in controlled social settings and gaining confidence at her own pace. Continued positive-reinforcement training, management, and consistency will be essential for her success.

🏡 Ideal Home
Chevy is looking for:
• A quiet, predictable home
• A fenced yard or safe outdoor space for zoomies
• No other pets
• Adults only or older, dog-savvy teens
• Experience with fearful or reactive dogs (or willingness to learn)
• Patience, structure, compassion, and consistency

She can experience separation anxiety but is learning to settle and does best when departures are part of a consistent routine. When left alone, she is generally calm, resting or entertaining herself with toys.

🚗 A Few More Things to Love
• Loves car rides and hops right in
• Non-destructive in the home
• Sleeps in bed and loves to snuggle
• Very polite with food and waits for permission

❤️ Why Chevy
Chevy isn't a "plug-and-play" dog – but for the right home, she is deeply rewarding. She forms strong emotional bonds and gives her whole heart to the people who make her feel safe. Watching her confidence grow – through brave moments, playful zoomies, and quiet cuddles – is incredibly special.

✨ Thanks to a generous sponsor, Chevy's adoption fee has been fully covered so she can land in the perfect home—where the focus is on the right match!

If you're ready to offer a calm, committed home and help a sensitive Great Dane continue to blossom, Chevy may be the dog you've been waiting for.`,

      goodWith: [], // No kids, no dogs, no cats

      specialNeeds: 'Fearful and anxious around new people – needs slow introductions. Requires experienced adopter comfortable with fearful/reactive dogs. Professional training in process.',

      medicalNotes: 'Spayed and gastropexied. No other known medical issues.',

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
          caption: 'Chevy enjoying outdoor time',
        },
        {
          _key: 'gallery-2',
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: gallery2._id,
          },
          caption: 'Sweet Chevy',
        },
        {
          _key: 'gallery-3',
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: gallery3._id,
          },
          caption: 'Chevy showing her gentle nature',
        },
      ],
    }

    const result = await client.create(chevyDoc)

    console.log('\n✅ Chevy profile created successfully!')
    console.log(`📄 Document ID: ${result._id}`)
    console.log(`🔗 View at: http://localhost:3000/available-danes/chevy`)
    console.log(`🎨 Edit in Studio: http://localhost:3000/studio/structure/dane;${result._id}`)

  } catch (error) {
    console.error('❌ Error creating Chevy profile:', error)
    process.exit(1)
  }
}

createChevy()
