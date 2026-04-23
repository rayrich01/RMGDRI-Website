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

      // Under Evaluation
      S.listItem()
        .title('🟠 Under Evaluation')
        .child(
          S.documentList()
            .title('Under Evaluation')
            .filter('_type == "dog" && status == "under-evaluation"')
        ),

      // Waiting Transport
      S.listItem()
        .title('🔵 Waiting Transport')
        .child(
          S.documentList()
            .title('Waiting Transport')
            .filter('_type == "dog" && status == "waiting-transport"')
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

      // Permanent Fosters
      S.listItem()
        .title('💜 Permanent Fosters')
        .child(
          S.documentList()
            .title('Permanent Foster Danes')
            .filter('_type == "dog" && status == "permanent-foster"')
            .defaultOrdering([{ field: 'name', direction: 'asc' }])
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

      // Hidden from Website (CR-79)
      S.listItem()
        .title('🚫 Hidden from Website')
        .child(
          S.documentList()
            .title('Hidden Dogs')
            .filter('_type == "dog" && hideFromWebsite == true')
            .defaultOrdering([{ field: 'name', direction: 'asc' }])
        ),

      S.divider(),

      // EVENTS SECTION
      S.listItem()
        .title('📅 Upcoming Events')
        .child(
          S.documentList()
            .title('Upcoming Events')
            .filter('_type == "event" && isActive == true && startDate >= now()')
            .defaultOrdering([{ field: 'startDate', direction: 'asc' }])
        ),

      S.listItem()
        .title('📆 Past Events')
        .child(
          S.documentList()
            .title('Past Events')
            .filter('_type == "event" && startDate < now()')
            .defaultOrdering([{ field: 'startDate', direction: 'desc' }])
        ),

      S.listItem()
        .title('📋 All Events')
        .child(
          S.documentList()
            .title('All Events')
            .filter('_type == "event"')
            .defaultOrdering([{ field: 'startDate', direction: 'desc' }])
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

      // Volunteer Opportunities (CR-97)
      S.listItem()
        .title('🤝 Volunteer Opportunities')
        .child(
          S.documentList()
            .title('Volunteer Positions')
            .filter('_type == "volunteerOpportunity"')
            .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])
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
        .title('🏆 Successes by Year')
        .child(
          S.list()
            .title('Select Year')
            .items([
              S.listItem()
                .title('2026 Successes')
                .child(
                  S.documentList()
                    .title('2026 Adoptions')
                    .filter('_type == "dog" && status == "adopted" && adoptionYear == "2026"')
                ),
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
