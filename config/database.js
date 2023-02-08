module.exports = ({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: '.tmp/database.db',
    },
    useNullAsDefault: true
  },
});
 