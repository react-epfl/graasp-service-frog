import { extendObservable, action } from 'mobx';
import { maxBy } from 'lodash';

import { store } from './index';
import Operator from './operator';

export type OperatorTypes = 'product' | 'social' | 'control';

export default class OperatorStore {
  constructor() {
    extendObservable(this, {
      all: [],

      mongoAdd: action((x: any) => {
        if (!store.findId({ type: 'operator', id: x._id })) {
          this.all.push(
            new Operator(
              x.time,
              x.y,
              x.type,
              x.data,
              x.operatorType,
              x._id,
              x.title,
              x.state
            )
          );
          store.refreshValidate();
        }
      }),

      mongoChange: action((newx: Operator, oldx: { _id: string }) => {
        store.findId({ type: 'operator', id: oldx._id }).update(newx);
        store.refreshValidate();
      }),

      mongoRemove: action((remx: { _id: string }) => {
        this.all = this.all.filter(x => x.id !== remx._id);
        store.refreshValidate();
      }),

      place: action((type: OperatorTypes) => {
        if (store.state.mode === 'normal') {
          store.state = { mode: 'placingOperator', operatorType: type };
        }
      }),

      addOperator: action(() => {
        if (store.state.mode === 'placingOperator') {
          this.all.push(
            new Operator(...store.ui.socialCoordsTime, store.state.operatorType)
          );
          store.state = { mode: 'normal' };
          store.addHistory();
        }
      }),

      get history(): Array<any> {
        return this.all.map(x => ({
          time: x.time,
          y: x.y,
          type: x.type,
          id: x.id,
          title: x.id,
          data: x.data,
          operatorType: x.operatorType
        }));
      },

      get furthestOperator(): number {
        const op = maxBy(this.all, x => x.time);
        return op && op.time + 1;
      }
    });
  }
}
