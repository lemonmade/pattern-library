import classBuilder from './class';
import methodBuilder from './method';
import propertyBuilder from './property';
import functionBuilder from './function';
import typeBuilder from './type';
import valueBuilder from './value';
import identifierBuilder from './identifier';
import importBuilder from './import';

import {ValueType, MemberType} from '../entities';

function literalBuilder({node: {value}}) {
  return ValueType({value});
}

literalBuilder.handles = (path) => path.isStringLiteral() || path.isNumericLiteral();

function assignmentBuilder(path, state) {
  const assignment = path.get('expression');
  const left = assignment.get('left');
  const entity = identifierBuilder(left.get('object'), state);
  if (entity == null) { return; }

  entity.members.push(
    MemberType({
      static: true,
      key: ValueType({value: left.get('property.name').node}),
      value: state.builder.get(assignment.get('right'), state),
    })
  );
}

assignmentBuilder.handles = (path) => path.isExpressionStatement() && path.get('expression').isAssignmentExpression() &&
  path.get('expression.left').isMemberExpression();

const BUILDERS = [
  classBuilder,
  methodBuilder,
  propertyBuilder,
  functionBuilder,
  typeBuilder,
  valueBuilder,
  identifierBuilder,
  importBuilder,
  assignmentBuilder,
  literalBuilder,
].filter((builder) => typeof builder.handles === 'function');

export default class Builder {
  entities = new Map();

  get(path, state) {
    const {node} = path;
    const {entities} = this;

    if (!entities.has(node)) {
      const matchingBuilder = BUILDERS.find((builder) => builder.handles(path));
      if (matchingBuilder) { entities.set(node, matchingBuilder(path, state)); }
    }

    return entities.get(node);
  }

  [Symbol.iterator]() {
    return this.entities.values();
  }
}

export {
  classBuilder,
  methodBuilder,
  propertyBuilder,
  functionBuilder,
  typeBuilder,
  valueBuilder,
  identifierBuilder,
  importBuilder,
};
