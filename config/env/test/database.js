module.exports = ({ env }) => ({
    connection: {
      client: 'sqlite',
      connection: {
        filename: 'tmp/test.db',
        timezone: 'Asia/Bangkok'
      },
      useNullAsDefault: true,
      debug: false
    },
});
   