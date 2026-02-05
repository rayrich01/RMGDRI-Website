import { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('RMGDRI Content')
    .items([
      // Available Danes - Most Used (all active statuses)
      S.listItem()
        .title('🐕 Available Danes')
        .child(
          S.documentList()
            .title('Available Danes')
            .filter('_type == "dog" && status in ["available", "foster-needed", "waiting-transport", "under-evaluation", "medical-hold", "behavior-hold", "pending"]')
        ),

      // Foster Needed - Priority
      S.listItem()
        .title('🔴 Needs Foster')
        .child(
          S.documentList()
            .title('Foster Needed')
            .filter('_type == "dog" && status == "foster-needed"')
        ),

      // Medical/Behavior Hold
      S.listItem()
        .title('🏥 Medical/Behavior Hold')
        .child(
          S.documentList()
            .title('On Hold')
            .filter('_type == "dog" && status in ["medical-hold", "behavior-hold"]')
        ),

      // Adoption Pending
      S.listItem()
        .title('⏳ Adoption Pending')
        .child(
          S.documentList()
            .title('Pending Adoptions')
            .filter('_type == "dog" && status == "pending"')
        ),

      // Recently Adopted (for creating blog posts)
      S.listItem()
        .title('🎉 Recently Adopted')
        .child(
          S.documentList()
            .title('Adopted Danes')
            .filter('_type == "dog" && status == "adopted"')
            .defaultOrdering([{ field: 'adoptionDate', direction: 'desc' }])
        ),

      S.divider(),

      // Dog Blog Posts
      S.listItem()
        .title('📝 Dog Blog Stories')
        .child(
          S.documentList()
            .title('Success Stories')
            .filter('_type == "successStory"')
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
        ),

      S.divider(),

      // All Dogs (for searching/reference)
      S.listItem()
        .title('📋 All Dogs')
        .child(
          S.documentList()
            .title('All Dogs')
            .filter('_type == "dog"')
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
        ),

      // Success Galleries by Year
      S.listItem()
        .title('📅 Successes by Year')
        .child(
          S.list()
            .title('Select Year')
            .items([
              S.listItem()
                .title('2025 Successes')
                .child(
                  S.documentList()
                    .title('2025 Adoptions')
                    .filter('_type == "dog" && status == "adopted" && adoptionYear == "2025"')
                ),
              S.listItem()
                .title('2024 Successes')
                .child(
                  S.documentList()
                    .title('2024 Adoptions')
                    .filter('_type == "dog" && status == "adopted" && adoptionYear == "2024"')
                ),
              S.listItem()
                .title('2023 Successes')
                .child(
                  S.documentList()
                    .title('2023 Adoptions')
                    .filter('_type == "dog" && status == "adopted" && adoptionYear == "2023"')
                ),
              S.listItem()
                .title('2022 Successes')
                .child(
                  S.documentList()
                    .title('2022 Adoptions')
                    .filter('_type == "dog" && status == "adopted" && adoptionYear == "2022"')
                ),
            ])
        ),

      S.divider(),

      // Static Pages (rarely used)
      S.listItem()
        .title('📄 Pages')
        .child(
          S.documentList()
            .title('Static Pages')
            .filter('_type == "page"')
        ),
    ])
