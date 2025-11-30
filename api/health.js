({
  async check({ message }) {
    console.log('message: ', message);
    return { status: 'ok' };
  },
});
