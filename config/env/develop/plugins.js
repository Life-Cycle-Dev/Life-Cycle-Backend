module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "@strapi-community/strapi-provider-upload-google-cloud-storage",
      providerOptions: {
        bucketName: env('STORAGE_BUCKET_NAME', 'lifecycle-bucket'),
        publicFiles: true,
        uniform: true,
        basePath: "",
      },
    },
  },
});
