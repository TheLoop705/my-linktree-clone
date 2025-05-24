# Setup test database
$env:DATABASE_URL = "file:./test.db"
npx prisma db push
