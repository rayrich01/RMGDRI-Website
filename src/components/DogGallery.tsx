type GalleryImage = {
  asset: { _id: string; url: string }
  alt?: string
  caption?: string
  _key?: string
}

export default function DogGallery({ images }: { images?: GalleryImage[] }) {
  if (!images || images.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Photos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <figure
            key={img._key || img.asset._id || i}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
          >
            <img
              src={img.asset.url}
              alt={img.alt || 'Dog photo'}
              className="object-cover w-full h-full"
              loading="lazy"
            />
            {img.caption && (
              <figcaption className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-3 py-1.5">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  )
}
