declare namespace api {
  const messenger: {
    method(params: { arg: any }): Promise<{ status: string }>;
  };
}
