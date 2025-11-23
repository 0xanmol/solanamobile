# API Examples

This folder contains example API call implementations that demonstrate:

1. **Expected API endpoint structure** - What endpoints should exist
2. **Request/Response data formats** - What data to send and expect back
3. **How to update the state store** - How to sync API responses with the app's state

## Important Notes

- These functions are **examples only** and should NOT be called automatically
- They serve as a reference for backend developers to understand:
  - What API endpoints need to be implemented
  - What data structure the frontend expects
  - How to update the Zustand store after API calls

## Usage Pattern

When implementing the actual API integration:

1. Replace the `fetch` calls with your actual API client
2. Handle the response data structure as shown in these examples
3. Update the store using the same patterns shown here
4. Add proper error handling and loading states

## API Endpoints Covered

### Pots
- `POST /api/pots` - Create a new pot
- `GET /api/pots` - Get all pots
- `GET /api/pots?userAddress=...` - Get pots for a specific user
- `GET /api/pots/:id` - Get pot by ID
- `PATCH /api/pots/:id` - Update pot details
- `DELETE /api/pots/:id` - Delete a pot
- `POST /api/pots/:id/contributors` - Add contributor to pot
- `DELETE /api/pots/:id/contributors/:address` - Remove contributor from pot
- `POST /api/pots/:id/contributions` - Add contribution to pot
- `DELETE /api/pots/:id/contributions/:contributionId` - Remove contribution
- `POST /api/pots/:id/release` - Release pot funds

### Friends
- `POST /api/friends` - Add a friend
- `GET /api/friends` - Get all friends
- `GET /api/friends/:id` - Get friend by ID
- `GET /api/friends?address=...` - Get friend by address
- `PATCH /api/friends/:id` - Update friend (e.g., display name)
- `DELETE /api/friends/:id` - Remove a friend

### Activities
- `GET /api/activities` - Get all activities
- `GET /api/activities?userAddress=...` - Get activities for a user
- `GET /api/activities?potId=...` - Get activities for a pot
- `POST /api/activities/:id/read` - Mark activity as read

## Data Structure Reference

See `types.ts` for complete TypeScript type definitions of all data structures.

