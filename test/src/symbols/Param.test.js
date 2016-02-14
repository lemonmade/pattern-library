/* @flow */

import {expect, firstSymbol} from 'test-helper';
import {Type} from 'symbols';

describe('Param', () => {
  const paramName = 'arg1';

  context('without type information', () => {
    it('extracts the name', () => {
      const param = firstParamFromSource(`function foo(${paramName}) {}`);
      expect(param.name).to.equal(paramName);
    });
  });

  context('with type information', () => {
    it('extracts the name', () => {
      const param = firstParamFromSource(`function foo(${paramName}: string) {}`);
      expect(param.name).to.equal(paramName);
    });

    it('extracts a simple type', () => {
      const type = 'string';
      const param = firstParamFromSource(`function foo(${paramName}: ${type}) {}`);
      expect(param.type).to.be.an.instanceOf(Type);
      expect(param.type.types).to.deep.equal([type]);
      expect(param.type.union).to.be.false;
      expect(param.type.intersection).to.be.false;
    });
  });
});

function paramFromSource(source: string, {atIndex: index}: {atIndex: number}) {
  return firstSymbol(source).params[index];
}

function firstParamFromSource(source: string) {
  return paramFromSource(source, {atIndex: 0});
}
