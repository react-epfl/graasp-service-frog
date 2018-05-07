// @flow
import * as React from 'react';
import {
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryAxis,
  VictoryTheme
} from 'victory';
import { HTML, entries } from 'frog-utils';

import Typography from 'material-ui/Typography';

const Question = ({ question, answers }) => (
  <React.Fragment>
    <Typography align="center" variant="button" gutterBottom>
      <HTML html={question} />
    </Typography>
    <VictoryChart
      height={100}
      theme={VictoryTheme.material}
      style={{
        tickLabels: { fontSize: 10 }
      }}
      padding={{ top: 0, left: 150, right: 0, bottom: 30 }}
      domainPadding={20}
    >
      <VictoryAxis
        tickLabelComponent={<VictoryLabel />}
        style={{ tickLabels: { fontSize: 7 } }}
      />
      <VictoryAxis
        dependentAxis
        tickLabelComponent={<VictoryLabel />}
        style={{ tickLabels: { fontSize: 7 } }}
      />
      <VictoryBar
        horizontal
        data={answers}
        style={{
          data: {
            fillOpacity: 1,
            strokeWidth: 1
          }
        }}
      />
    </VictoryChart>
  </React.Fragment>
);

const Viewer = ({ state }: { state: Object }) => (
  <div>
    {entries(state).map(([k, v]) => (
      <Question key={k} question={k} answers={v} />
    ))}
  </div>
);

export default Viewer;
