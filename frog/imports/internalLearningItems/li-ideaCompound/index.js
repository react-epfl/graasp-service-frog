// @flow

import * as React from 'react';
import { type learningItemT, ReactiveText } from 'frog-utils';

const ThumbViewer = ({ dataFn, data }) => (
  <React.Fragment>
    <b>{data.title}</b>
    <br />
    {data.content.split('\n').map((line, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ))}
    {data.attachments.map(x => (
      <dataFn.LearningItem key={x} id={x} type="thumbView" />
    ))}
  </React.Fragment>
);

const Editor = ({ data, dataFn }) => (
  <React.Fragment>
    <div className="bootstrap">
      <b>Title:</b>
      <br />
      <ReactiveText type="textinput" path="title" dataFn={dataFn} />
      <br />
      <br />
      <b>Content:</b>
      <br />
      <ReactiveText path="content" type="textarea" dataFn={dataFn} />
    </div>
    {data.attachments.map((x, i) => (
      <span key={x} onClick={() => dataFn.listDel(x, ['attachments', i])}>
        <dataFn.LearningItem id={x} type="thumbView" />
      </span>
    ))}
    <div style={{ position: 'absolute', right: '0px' }}>
      <dataFn.LearningItem
        type="create"
        onCreate={e => dataFn.listAppend(e, 'attachments')}
      />
    </div>
  </React.Fragment>
);

export default ({
  name: 'Idea with attachments',
  id: 'li-ideaCompound',
  ThumbViewer,
  Editor,
  dataStructure: { title: '', content: '', attachments: [] }
}: learningItemT);