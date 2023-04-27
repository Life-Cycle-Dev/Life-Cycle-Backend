module.exports = ({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: 'tmp/database.db',
      timezone: 'Asia/Bangkok'
    },
    useNullAsDefault: true
  },
});
 