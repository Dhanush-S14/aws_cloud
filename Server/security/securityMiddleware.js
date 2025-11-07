import helmet from "helmet";
import hpp from "hpp";

export const applySecurity = (app) => {
  app.use(
    helmet({
      hsts: {
        maxAge: 63072000,
        includeSubDomains: true,
        preload: true,
      },
      frameguard: {
        action: "sameorigin",
      },
      noSniff: true,
      xssFilter: true,
      contentSecurityPolicy: false,
    })
  );

  app.use(hpp());
};
