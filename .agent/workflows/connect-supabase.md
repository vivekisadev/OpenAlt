---
description: Connect the application to a Supabase PostgreSQL database
---

# Connect to Supabase (PostgreSQL)

This workflow guides you through migrating your local SQLite database to a production-ready PostgreSQL database using Supabase.

## Prerequisites
- A GitHub account (to sign up for Supabase)

## Steps

1.  **Create a Supabase Project**
    - Go to [database.new](https://database.new) and sign in with GitHub.
    - Create a new project.
    - Set a database password (make sure to save this!).
    - Choose a region close to your users.
    - Click "Create new project".

2.  **Get Connection String**
    - Once the project is created (takes a minute), go to **Project Settings** (cog icon at the bottom left).
    - Go to **Database**.
    - Under **Connection parameters**, find the **Connection String** section.
    - Click on **URI**.
    - Copy the connection string. It will look like: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
    - *Note: You will need to replace `[password]` with the password you created in step 1.*

3.  **Update Environment Variables**
    - Open your `.env` file in the project root.
    - Replace the existing `DATABASE_URL` with your new Supabase connection string.
    ```env
    DATABASE_URL="postgresql://postgres.your-ref:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
    ```
    - *Tip: Add `?pgbouncer=true` to the end of the URL for better connection pooling with Prisma.*

4.  **Update Prisma Schema**
    - Open `prisma/schema.prisma`.
    - Change the datasource provider from `"sqlite"` to `"postgresql"`.
    ```prisma
    datasource db {
      provider = "postgresql" // Changed from "sqlite"
      url      = env("DATABASE_URL")
    }
    ```

5.  **Push Schema to Supabase**
    - Run the following command in your terminal to create the tables in your new database:
    ```bash
    npx prisma db push
    ```

6.  **Restart Development Server**
    - Stop your current server (Ctrl+C).
    - Run `npm run dev` again.

## Verification
- Try submitting a new tool on your website.
- It should now be saved to your Supabase cloud database!
