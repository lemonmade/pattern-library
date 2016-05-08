import define from 'librarian/entities';
import {stringType, nodeType, arrayOf, booleanType} from 'librarian/types';
import ParamType from './param';
import TypeType from './type';

export default define('Function', {
  properties: {
    name: {type: stringType},
    params: {type: arrayOf(nodeType(ParamType)), default: []},
    async: {type: booleanType, default: false},
    generator: {type: booleanType, default: false},
    returns: {type: nodeType(TypeType), optional: true},
  },
});