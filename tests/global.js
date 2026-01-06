import app from '../src/app.js';

globalThis.app = app;

after(() => {
  return Promise.all([
    // Add any promises here for processes that need to be closed before the tests can finish

  ]);
});
