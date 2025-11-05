# Backend Setup Instructions

## How to Start the Backend

1. **Open the project in Visual Studio**
   - Open `MAPPPortal.sln` in Visual Studio

2. **Set the startup project**
   - Right-click on `MAPPPortal.Server` project
   - Select "Set as Startup Project"

3. **Choose the correct profile**
   - In Visual Studio, select the profile dropdown (next to the green play button)
   - Choose **"http"** profile (NOT "https")
   - This will run on `http://localhost:5204`

4. **Start the backend**
   - Press F5 or click the green play button
   - Wait for the backend to start
   - You should see output like: "Now listening on: http://localhost:5204"

## Verify Backend is Running

1. **Open browser** and go to: `http://localhost:5204/api/health`
   - You should see: `{"status":"healthy","message":"Backend is running","timestamp":"..."}`

2. **Or test the projects endpoint**: `http://localhost:5204/api/projects`
   - You should see: `[]` (empty array if no projects)

## Common Issues

### Backend not starting?
- Check if port 5204 is already in use
- Check Visual Studio Output window for errors
- Make sure database exists (run migrations if needed)

### CORS errors?
- CORS is configured to allow all origins in Development
- If you see CORS errors, check Program.cs CORS configuration

### Database connection errors?
- Make sure SQL Server is running
- Verify connection string in `appsettings.json`
- Run migrations: `dotnet ef database update`

