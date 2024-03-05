## DB Migrations
[2024-1-29-uuid.js](2024-1-29-uuid.js): Migrate GraphDB data from using incremental ID to UUID.
Run the migration script independently, ensuring the backend server is shut down beforehand.
```shell
node ./backend/migrations/2024-1-29-uuid.js
```