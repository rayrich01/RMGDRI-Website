#!/usr/bin/env node
/**
 * Create Kevin's profile in Sanity
 * Uploads images and creates the dog document
 */

import { createClient } from '@sanity/client'
import { createReadStream } from 'fs'
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

async function createKevin() {
  console.log('🐕 Creating Kevin profile...\n')

  try {
    // Upload hero image
    const heroImage = await uploadImage(
      'public/images/dogs/kevin/hero.jpg',
      'kevin-hero.jpg'
    )

    // Upload gallery images
    const gallery1 = await uploadImage(
      'public/images/dogs/kevin/gallery-1.jpg',
      'kevin-gallery-1.jpg'
    )
    const gallery2 = await uploadImage(
      'public/images/dogs/kevin/gallery-2.jpeg',
      'kevin-gallery-2.jpeg'
    )
    const gallery3 = await uploadImage(
      'public/images/dogs/kevin/gallery-3.jpeg',
      'kevin-gallery-3.jpeg'
    )

    // Create the dog document
    const kevinDoc = {
      _type: 'dog',
      name: 'Kevin',
      slug: {
        _type: 'slug',
        current: 'kevin',
      },
      breed: 'Great Dane',
      age: '4-5 years',
      sex: 'male',
      color: 'Harlequin',
      weight: 110,
      ears: 'cropped',
      status: 'pending',
      featured: true,

      shortDescription: 'Kevin is a sweet, 4-year-old Harlequin Great Dane with a heart arrhythmia managed with affordable medication. He\'s affectionate, loyal, and looking for an experienced adult-only home.',

      description: `After receiving the medical care he needed in foster, Kevin is now ready to find a forever family who will love him as much as he loves being loved! This sweet, 4-year-old Great Dane has a heart arrhythmia that's easily managed with twice-daily medication costing about $15/month. While his condition requires some monitoring during anesthesia and limits intense activity, it hasn't stopped him from being a goofy, affectionate, and deeply loyal companion.

🏡 What Kevin Needs in a Forever Home
Kevin is looking for a calm, experienced home where he can continue his progress with people who understand giant breeds and are comfortable managing leash reactivity.

Here's what makes a great match:
🚫 Only Pet: Kevin must be the only animal in the home—no dogs, cats, or small pets.
👨‍👩‍👧‍👦 Adults Only: No young children or elderly residents due to his size, strength, and high energy moments. He loves adults!
🌳 Fenced Yard: A secure yard is ideal for his zoomies and playtime.
🧘 Low-Stress Environment: Kevin does best in a quiet home where he can build confidence at his own pace. He's also not a barker so he won't add to the noise!
🎯 Committed Owner: An adopter with experience handling large dogs and dedication to continuing his training will help Kevin thrive long-term.

🐶 Kevin's Personality
Kevin is a classic Velcro Dane—he thrives on being close to his people, whether he's lounging on the couch, leaning into you for pets, or following you around the house. He's a clown at heart with a love for zoomies, plush toys, and silly antics that keep everyone smiling. While laid-back and mellow most of the time, he lights up during playtime and enjoys every moment of connection with his humans.
He's friendly with familiar people and visitors, though he may take a little time to warm up in new situations.

🎓 Kevin's Training & Skills
✅ House & crate trained – No accidents and relaxes well when crated
✅ Knows sit, down, come, and heel – working on leash reactivity
✅ Gentle with toys – Loves fetch, squeaky toys, and self-entertainment
✅ Meal manners – Polite and respectful around food and toys

🌟 Progress in Foster
Kevin has made incredible strides in his foster home. Once startled by everything, he's now comfortable in his routine and enjoying life—especially car rides, snuggling on the couch, and practicing leash work. His foster family is happy to provide insights, tools, and support to help with a smooth transition. Kevin still needs to work on his leash reactivity and needs an owner committed to ongoing training.

💙 Why Kevin?
Kevin is a beautiful blend of silly and sweet. From his happy zoomies to his loving cuddles, he brings a ton of joy to those around him. With structure, patience, and ongoing training, he will be a fiercely loyal and loving companion.
If you're ready to open your heart and home to this big-hearted boy, Kevin is ready to lean into the next chapter of his life—with you. 💫`,

      goodWith: [], // No kids, no dogs, no cats

      specialNeeds: 'Daily heart medication ($15-18 per month). Requires monitoring during anesthesia and limited intense activity.',

      medicalNotes: 'Heart arrhythmia managed with twice-daily medication (~$15/month). Requires anesthesia monitoring and activity limitations.',

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
          caption: 'Kevin enjoying playtime',
        },
        {
          _key: 'gallery-2',
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: gallery2._id,
          },
          caption: 'Kevin showing off his Harlequin coat',
        },
        {
          _key: 'gallery-3',
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: gallery3._id,
          },
          caption: 'Kevin ready for adventure',
        },
      ],
    }

    const result = await client.create(kevinDoc)

    console.log('\n✅ Kevin profile created successfully!')
    console.log(`📄 Document ID: ${result._id}`)
    console.log(`🔗 View at: http://localhost:3000/available-danes/kevin`)
    console.log(`🎨 Edit in Studio: http://localhost:3000/studio/structure/dane;${result._id}`)

  } catch (error) {
    console.error('❌ Error creating Kevin profile:', error)
    process.exit(1)
  }
}

createKevin()
