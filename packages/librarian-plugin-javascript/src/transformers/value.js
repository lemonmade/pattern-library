import {ValueType} from '../entities';
import typeFromPath from './type';
import {getCommentBlockForPath, getTagsFromCommentBlock} from 'librarian/src/utilities';
import {locationFromPath, exportDetailsFromPath} from '../utilities';

export default function valueFromPath(valuePath, state) {
  const name = valuePath.get('id.name').node;
  const commentBlock = getCommentBlockForPath(valuePath);

  return ValueType({
    name,
    value: valuePath.get('init.value').node,
    location: locationFromPath(valuePath, state),
    ...getTagsFromCommentBlock(commentBlock, state),
  });
}