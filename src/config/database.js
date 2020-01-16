module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'petbuddy',
  define: {
    timestamp: true,
    underscored: true,
    underscoredAll: true,
  },
};
