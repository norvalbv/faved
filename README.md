# Faved - Content Review Platform

Faved is a modern content review platform that helps teams manage and review content submissions efficiently. It features AI-powered analysis, automated feedback, and a streamlined review process, historical data imports, etc.

## Features

- 🤖 AI-powered content analysis
- 📝 Automated feedback generation
- 📊 Campaign management
- 👥 Team collaboration
- 📁 File submissions support (images, videos, audio, PDFs)
- 🔄 Multi-stage review process
- 📈 Progress tracking

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS, Shadcn/UI, Radix
- **Backend**: Next.js Server Actions, DrizzleORM
- **Database**: PostgreSQL (Neon)
- **AI**: OpenAI GPT-4o-mini

## Prerequisites

- PostgreSQL database (this project uses [Neon](https://neon.tech))
- OpenAI API key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=="postgres://user:password@host:port/database"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/norvalbv/faved.git
cd faved
```

2. Install dependencies (I like Bun 😼):
```bash
bun install
```

3. Set up your environment variables as described above

4. Run database generation:
```bash
bun run db:generate
```

5. Push database to neon:
```bash
bun run db:push
```

6. Seed database. This is important as it seeds the database with the necessary briefs, and other data:
```bash
bun run db:seed
```

7. Run development server:
```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
/lib
  /actions        # Server actions
  /data-store     # Database models and repositories
  /services       # External services (AI, storage)
  /types          # TypeScript types
  /utils          # Utility functions
/src
  /app           # Next.js app router pages
  /components    # React components
    /ui          # Reusable UI components
```
## Usage

1. **Browse Active Projects**: Access your active projects populated with Milanote's seeded data.

2. **Access Project Briefs**: Review comprehensive briefs imported from Milanote.

3. **Upload Content**: Submit files and scripts according to brief specifications.

4. **AI Review Process**: Leverage AI-powered analysis for quick and thorough submission reviews. If the script or submission is completely off track, the AI will auto-reject the submission.

5. **Collaborative Feedback**: Provide detailed comments and revision requests on submissions.

6. **Data Import**: Import and integrate historical project data as needed.


Screenshots:

![A screenshot of an AI rejection response about a submission.](./public/message-ai-thread-reject.png)
![A screenshot of an AI response about a submission.](./public/message-ai-thread-in-review.png)
![Campaigns overview example.](./public/campaigns-overview-example.png)
![Briefs overview](./public/briefs-overview-example.png)