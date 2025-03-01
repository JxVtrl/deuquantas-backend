export default () => ({
  database: {
    host: process.env.DATABASE_HOST || 'deuquantas-db',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || '1029',
    name: process.env.DATABASE_NAME || 'deuquantas',
  },
});
