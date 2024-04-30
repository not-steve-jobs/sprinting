import {BootstrapConsole} from 'nestjs-console';
import {AppModule} from './app.module';

export const bootstrap = new BootstrapConsole({
  module: AppModule,
  useDecorators: true,
});

bootstrap.init().then(async (app) => {
  try {
    await app.init();
    // Boot the cli.
    await bootstrap.boot();
    process.exit(0);
  } catch (e) {
    process.exit(1);
  }
});
