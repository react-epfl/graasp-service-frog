// @flow

import { values, flatten, uniqBy } from 'lodash';
import { type productOperatorT, wrapUnitAll } from 'frog-utils';

export const meta = {
  name: 'Aggregate best ideas',
  type: 'product'
};

export const config = {
  type: 'object',
  properties: {
    n: {
      type: 'number',
      title: 'Number of ideas per group'
    }
  }
};

const operator = (configData, object) => {
  const { activityData } = object;
  const prod = activityData.payload;
  const sel = Object.keys(prod).map(x => prod[x].data);
  const sel2 = sel.map(x =>
    values(x)
      .sort((a, b) => b.score - a.score)
      .slice(0, (configData && configData.n) || 1)
  );
  const ret = flatten(sel2);
  return wrapUnitAll(uniqBy(ret, x => x.id));
};

export default ({
  id: 'op-select-best',
  operator,
  config,
  meta
}: productOperatorT);
