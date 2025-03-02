# Project Adventures

To install dependencies:

```bash
npm install
```

To run:

```bash
npm run start
```

### Before starting the project

Create an .env file with corresponding content (we use SQLite for simplicity) : 
```env
DATABASE_URL=file:dev.db
```

Run migration scripts
```bash
npx prisma migrate deploy 
```
Run seed scripts
```bash
npx prisma db seed
```
