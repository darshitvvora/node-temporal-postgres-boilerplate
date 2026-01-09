declare module 'node-webhooks' {
  interface WebHooksOptions {
    db: string;
    DEBUG?: boolean;
  }

  class WebHooks {
    constructor(options: WebHooksOptions);
    trigger(event: string, data: any): Promise<any>;
    getEmitter(): any;
  }

  export = WebHooks;
}
