# Collaborative Text Editor

This project is a collaborative text editor built with a React frontend and an Express backend. It allows users to securely create, edit, and share documents with collaborators using encryption for data security.

## Features

### Frontend
- **React with Vite**: Fast and modern development setup.
- **User Authentication**: GitHub OAuth for secure login.
- **Document Management**: Create, edit, and view documents.
- **Collaboration**: Share documents with collaborators.
- **Encryption**: AES and RSA encryption for secure data sharing.

### Backend
- **Express.js**: Lightweight and efficient server.
- **MongoDB**: Database for storing user and document data.
- **JWT Authentication**: Secure API access.
- **Rate Limiting**: Prevent abuse with request rate limiting.

## Project Structure

### Frontend (`collabTextEditorFE`)
- **`src/components`**: Reusable React components like `Header`, `DocumentList`, and `PrivateKeyModal`.
- **`src/pages`**: Pages like `DashboardPage`, `LoginPage`, and `AddDocumentPage`.
- **`src/services`**: Service files for API calls and encryption logic.
- **`vite.config.js`**: Vite configuration for development and proxy setup.

### Backend (`collabTextEditorBE`)
- **`models`**: Mongoose schemas for `User` and `Document`.
- **`controller`**: Logic for handling authentication and document APIs.
- **`middleware`**: JWT authentication middleware.
- **`utils`**: Utility functions like JWT token generation and verification.

## Installation

### Prerequisites
- Node.js (v16 or later)
- MongoDB

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd collabTextEditor
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   cd collabTextEditorFE
   npm install
   cd ../collabTextEditorBE
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in `collabTextEditorBE` with the following:
     ```env
     MONGO_URI=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
     GITHUB_CLIENT_ID=<your-github-client-id>
     GITHUB_CLIENT_SECRET=<your-github-client-secret>
     GITHUB_CALLBACK=<your-github-callback-url>
     REACT_URL=<frontend-url>
     ```

4. Start the backend server:
   ```bash
   cd collabTextEditorBE
   node server.js
   ```

5. Start the frontend development server:
   ```bash
   cd collabTextEditorFE
   npm run dev
   ```

## Usage

1. Open the frontend in your browser (default: `http://localhost:5173`).
2. Log in using your GitHub account.
3. Create a new document, add collaborators, and start editing securely.

## Security
- **AES-GCM**: Used for encrypting document content.
- **RSA-OAEP**: Used for encrypting AES keys.
- **GitHub Gists**: Public keys are stored securely in GitHub Gists.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [GitHub OAuth](https://docs.github.com/en/developers/apps/building-oauth-apps)