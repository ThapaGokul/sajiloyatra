# Sajilo Yatra 🇳🇵

> **Experience Nepal like a local.**
> A digital platform connecting authentic local hosts with travelers seeking genuine cultural immersion.


##  About The Project

**Sajilo Yatra** (meaning "Easy Journey" in Nepali) addresses the fragmentation in Nepal's tourism market. While generic booking platforms exist for hotels, travelers struggle to find verified local guides or authentic homestays.

This platform bridges that gap by providing a trusted marketplace where:
* **Travelers** can discover and book authentic local experiences securely.
* **Locals** can create digital profiles to showcase their guiding services or homestays to a global audience.

**Live Demo:** https://sajiloyatra.me

##  Key Features

* ** Secure Authentication:**
    * Social Login via **Google OAuth**.
    * Traditional Email/Password login with secure Bcrypt hashing.
    * Session management via HttpOnly Cookies (JWT).

* ** Find a Local:**
    * Rich gallery view of verified Local Guides and Hosts.
    * Filter by location (e.g., Pokhara, Kathmandu).
    * Detailed profiles with bios, specialties, and photos.

* ** Smart Booking System:**
    * Interactive date-picker widget.
    * Automatic cost calculation (Nightly Rate × Duration).
    * User-friendly booking validation (preventing past dates).

* ** Secure Payments:**
    * Integrated **PayPal** Sandbox for secure, international transaction simulation.
    * Instant booking confirmation upon payment success.

* ** Profile Management:**
    * Locals can register as hosts.
    * Image upload functionality powered by **Vercel Blob** storage.

## 🛠️ Tech Stack

**Frontend & Backend (Full Stack):**
* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Language:** JavaScript (ES6+)
* **Styling:** CSS Modules (Responsive Design)

**Database & Storage:**
* **Database:** PostgreSQL (Hosted on Supabase/Neon)
* **ORM:** Prisma
* **File Storage:** Vercel Blob (for profile images)

**Testing:**
* **Unit Testing:** Jest
* **Component Testing:** React Testing Library

##  Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
* Node.js (v18 or higher)
* npm (v9 or higher)
* A PostgreSQL Database URL

### Installation

1.  **Clone the repo**
    ```bash
    git clone [https://github.com/your-username/sajilo-yatra.git](https://github.com/your-username/sajilo-yatra.git)
    cd sajilo-yatra
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory. **DO NOT commit this file.**
    ```env
    # Database
    DATABASE_URL="postgresql://user:password@host:port/db_name"

    # Authentication
    JWT_SECRET="your_super_secret_string"
    GOOGLE_CLIENT_ID="your_google_client_id"
    GOOGLE_CLIENT_SECRET="your_google_client_secret"
    
    # Payments (PayPal Sandbox)
    NEXT_PUBLIC_PAYPAL_CLIENT_ID="your_paypal_client_id"

    # Image Upload
    BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
    ```

4.  **Database Migration**
    Push the schema to your database.
    ```bash
    npx prisma db push
    ```

5.  **Run the App**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

##  Testing

We adhere to a robust testing strategy covering critical financial and authentication flows.

```bash
# Run all tests
npm test

# Run a specific test suite
npm test src/test/BookingWidget.test.js
