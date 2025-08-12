# This is Our AI assissted virtual community hub - VAANI

## Project info

Build a voice-enabled Virtual Community Manager that serves two primary functions: Support Management (allow residents to raise complaints or service requests and track their resolution using natural speech) and Community Engagement Assistant (recommend potential events to the community manager, assist in promoting selected events, and gather feedback and analytics post-event).

Key Features
•
Voice Input via Omnidim.io: Residents log complaints through the Voice AI Assistant including details like issue type, location (room/floor), and a brief description.
•
Automated Ticket Creation: System converts voice input into structured ticket format, assigns predefined priority levels (P1–P4) based on keywords and issue types, and allocates tickets to available technicians based on specialization and availability.
•
Ticket Tracking: When residents provide ticket numbers, the assistant responds with current status (Assigned, In Progress, Resolved). Allows status checks using voice commands like "What's the update on ticket 2035?"
•
Event Suggestions to Community Managers: The system suggests event ideas based on past successful events, facilities available at the property (e.g., terrace, lounge, garden), and calendar context (e.g., weekends, festivals).
•
Event Promotion Assistance: Helps create and broadcast event announcement messages (text or voice-based) for community platforms like WhatsApp, bulletin boards, and internal apps.
•
Feedback Collection & Analytics: Post-event, the assistant collects resident feedback via voice, short surveys, or ratings and generates basic analytics such as attendance count, positive/negative feedback trends, and engagement scores.
Deliverables
•
Working Voice Interface (Using Omnidim.io): Residents can log complaints via voice and provide ticket numbers to get status updates through voice commands.
•
Complaint Management Backend: Ticket generation based on voice input, priority tagging (P1–P4) based on predefined keyword mapping, and technician/staff assignment (mocked or basic logic is acceptable).
•
Event Recommendation Module: Suggest events dynamically based on internal calendar, available infrastructure (you may mock this input), and past events stored in a mock dataset.
•
Promotion Assistance: Generate sample text announcements and/or voice-friendly promotion scripts for at least 2 recommended events.
•
Feedback & Analytics Dashboard: Collect and store feedback (ratings, voice responses, text) and display basic analytics including participation estimates (mock input acceptable), feedback distribution, and event popularity ranking.

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e9469e5f-c3b3-4e0c-a5b9-6f05ef32ed7c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
