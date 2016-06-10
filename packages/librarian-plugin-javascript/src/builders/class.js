import {ClassType} from '../entities';
import {locationFromPath} from '../utilities';

export default function classBuilder(classPath, state) {
  const {builder} = state;
  const name = classPath.get('id.name').node;

  const result = ClassType({
    name,
    extends: classPath.has('superClass')
      ? builder.get(classPath.get('superClass'), state)
      : null,
    members: classPath.get('body.body')
      .map((member) => builder.get(member, state))
      .filter((member) => member != null),
    location: locationFromPath(classPath, state),
  });
  return result;
}

classBuilder.handles = (path) => path.isClassDeclaration() || path.isClassExpression();
