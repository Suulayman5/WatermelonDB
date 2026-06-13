declare interface NodeRequire {
  context?: (path: string, recursive?: boolean, regex?: RegExp) => {
    keys(): string[];
    <T>(id: string): T;
  };
}
