import mongoSanitize from "express-mongo-sanitize";

export const mongoSecurity = (app) => {
  app.use(
    mongoSanitize({
      replaceWith: "_",
      onSanitize: ({ req, key }) => {
        console.warn(
          `[MongoSanitize] Key sanitized: ${key} | Value: ${req.body[key]}`
        );
      },
    })
  );
};
