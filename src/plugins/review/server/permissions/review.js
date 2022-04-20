const registerActions = async (strapi) => {
  const reviewModelUIDs = Object.values(strapi.contentTypes).filter((contentType) => contentType.options && contentType.options.draftAndPublish).map((contentType) => contentType.uid);

  const actions = [
    {
      section: "contentTypes",
      displayName: "Review",
      uid: 'explorer.review',
      pluginName: "content-manager",
      subjects: [...reviewModelUIDs], //derive all collection types
      options: {
        applyToProperties: ['fields'],
      }
    },
  ];
  const { actionProvider } = strapi.admin.services.permission;
  await actionProvider.registerMany(actions);
};

module.exports = { registerActions };