## Project Documentation
### Project objective and problem statement
in progress


### User Stories
[User Stories](https://docs.google.com/spreadsheets/d/1It13BWouW99uSM98JpU-bYHHyT9SF0IAGl1NFlD872o/edit?usp=sharing)

### MVP features list
- **Authentication:**  
  - Allows users to sign up and log in using their email or google account. (Clerk)
- **Event Date and Time Selection:**  
  - Allows the host to select the date and time for the event.
- **Event Place Suggestion:**  
  Provides venue suggestions based on the user's location.
- **Digital Invitation Creation:**  
  - Customizable invitation templates with birthday themes (e.g., superheroes, princesses, animals, etc.).
- **Allegic Food Management:**  
  - Allows the host to ask guests to select their allegic food.
- **RSVP Management:**  
  - Online RSVP functionality enabling guests to confirm attendance.
  - Real-time attendance tracking and updates.
- **Reminder Notifications:**  
  Automated notifications for RSVP follow-ups and party detail reminders.
- **Attendance Tracking:**  
  - Tracks attendance at the event.
  - Sends reminders for RSVP follow-ups and party detail reminders.
- **Checklist Management:**  
  - Organizes party supplies and task lists.
  - Sends reminders for pending tasks.
- **AI powered Schedule Planner:**  
  - Automatically suggests a schedule for the event based on the RSVPs, selected date and time, and the event details.
- **Private Group Timeline:**  
  - Centralized communication hub for event-related discussions among invitees.
  - Reaction to the messages
- **Shopping List:**  
  - Allows the host to create a shopping list for the event.
- **Shared Photo Album:**  
  Allows all attendees to upload, manage, and view event photos.
- **AI powered Photo Organization:**  
  - Automatically categorizes uploaded photos by people using facial recognition
  - Groups photos of the same person together for easy viewing and sharing
  - Helps identify and organize photos of the birthday child and guests

### Tech stack specifications
#### Frontend
- **Frameworks/Libraries:** React, Next.js
- **Language:** TypeScript
- **Styling:** TailwindCSS, Shadcn/UI
- **State Management:** Zustand
- **Authentication:** Clerk
- **Maps:** Google Maps API

#### Backend
- **Server Options:** Express, Next.js API routes, or Hono (depending on project needs)
- **Database:**  
  - Primary: Supabase (PostgreSQL) with Prisma ORM  
  - Alternative: MongoDB with Mongoose (if required)
  - Convex for real-time data synchronization
- **Authentication:** Clerk
- **AI:** Gemini, OpenAI
- **Image Processing:** Cloudinary, Google Cloud Storage
- **Email:** Resend


#### Infrastructure & Deployment
- **Platforms:** Vercel, Render, or Cloud Run

#### Others
- **Version Control:** Git (hosted on GitHub)
- **Design:** Figma
- **Project Management:** Github Projects
- **CI/CD:** Github Actions