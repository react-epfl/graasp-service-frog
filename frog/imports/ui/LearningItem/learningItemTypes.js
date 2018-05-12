// @flow
import { type learningItemT } from 'frog-utils';

import fileLI from '../../internalLearningItems/li-file';
import ideaLI from '../../internalLearningItems/li-idea';
import imageLI from '../../internalLearningItems/li-image';
import ideaCompoundLI from '../../internalLearningItems/li-ideaCompound';

export const learningItemTypesObj: {
  [name: string]: learningItemT
} = {
  'li-idea': ideaLI,
  'li-file': fileLI,
  'li-image': imageLI,
  'li-ideaCompound': ideaCompoundLI
};