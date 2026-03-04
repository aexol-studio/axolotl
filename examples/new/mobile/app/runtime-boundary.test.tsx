describe('app layer runtime boundary', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('does not load templates integrations from app runtime entry', () => {
    const templateImportProbe = jest.fn();

    jest.doMock('../templates/integrations', () => {
      templateImportProbe();
      return {
        areTemplateBlueprintsEnabled: () => false,
      };
    });

    jest.isolateModules(() => {
      require('./_layout');
    });

    expect(templateImportProbe).not.toHaveBeenCalled();
  });
});
