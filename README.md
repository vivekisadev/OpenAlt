# OpenAlt 🚀 (Community Edition)

**OpenAlt** is a modern, community-driven platform designed to help developers and creators Discover and share the best open-source alternatives to popular proprietary software. Built with performance and aesthetics in mind, it features a sleek dark-mode UI, real-time search, and a robust submission system.

![OpenAlt Preview](https://via.placeholder.com/1200x600.png?text=OpenAlt+Preview+Image)

## ✨ Features

### 🔍 Discovery & Search
- **Curated Directory:** Explore a wide range of open-source tools across categories like AI, Dev Tools, Audio/Video, and more.
- **Smart Filtering:** Instantly filter tools by category or search by keywords, tags, and descriptions.
- **Detailed Views:** View comprehensive details for each tool, including features, pricing models, and direct links to repositories.

### 👥 Community Driven
- **User Accounts:** Secure sign-up and login functionality to join the community.
- **Submit Tools:** Users can contribute to the directory by submitting new open-source tools.
- **Status Tracking:** Track the approval status of your submissions directly from your dashboard.

### 🛡️ Admin & Moderation
- **Admin Dashboard:** A powerful dashboard for administrators to manage the platform.
- **Approval Workflow:** Review pending submissions, approve high-quality tools, or reject with feedback.
- **User Management:** Monitor user activity and manage the platform's content.

### 🎨 Modern UI/UX
- **Premium Design:** Features a stunning dark mode with Aurora background effects and glassmorphism.
- **Smooth Animations:** Powered by Framer Motion for a fluid and responsive user experience.
- **Responsive:** Fully optimized for all devices, from desktops to mobile phones.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [SQLite](https://www.sqlite.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

## 🚀 Getting Started

Follow these steps to run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/vivekisadev/OpenAlt.git
    cd OpenAlt
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the database:**
    ```bash
    npx prisma generate
    npx prisma db push
    npx prisma db seed # Optional: Seed with initial data
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open your browser:**
    Navigate to `http://localhost:3000` to see the app in action.

## 🤝 Contributing

Contributions are welcome! If you'd like to improve OpenAlt, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ by [Vivek](https://github.com/vivekisadev)
             

## 🌟 Acknowledgements

Special thanks to the open-source community for their invaluable contributions.
