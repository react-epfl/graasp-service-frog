import * as React from 'react';
import { type ActivityRunnerPropsT } from 'frog-utils';
import { withState } from 'recompose';
import Mousetrap from 'mousetrap';

import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import { texts, Guidelines, CountDownTimer } from './ActivityUtils';
import Symmetry from './Symmetry';
import Game from './Game';

let noAnswerTimeout;
let delayTimeout;
let changeActivityTimeout;

const styles = {
  root: {
    flexGrow: 1,
    height: '25px'
  },
  bar1Determinate: {
    backgroundColor: '#8994D1'
  },
  text: { fontSize: 'xx-large' },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  main: {
    width: '100%',
    height: '100%',
    backgroundColor: '#bbb'
  },
  commands: {
    marginTop: '20px'
  },
  activityCountdown: {
    display: 'flex'
  }
};

const Activity = withState('ready', 'setReady', false)(props => {
  const {
    data: { step },
    dataFn,
    activityData,
    logger
  } = props;
  const { ready, setReady } = props;
  const { timeOfEachActivity } = activityData.config;
  const activityTime = (timeOfEachActivity || 30000) * (step > 1 ? 2 : 1);

  const nextStep = () => {
    setReady(false);
    dataFn.numIncr(1, 'step');
    logger({ type: 'progress', value: (step + 1) / 4 });
  };

  const startActivity = () => {
    setReady(true);
    clearTimeout(changeActivityTimeout);
    changeActivityTimeout = setTimeout(nextStep, activityTime);
  };

  if (!ready) {
    return (
      <Guidelines start={startActivity} guidelines={texts.guidelines[step]} />
    );
  } else {
    return (
      <React.Fragment>
        <ActivityWithSpeed {...props} />
        <div style={styles.activityCountdown}>
          <CountDownTimer start={Date.now()} length={activityTime}>
            {texts.timeLeft}
          </CountDownTimer>
        </div>
      </React.Fragment>
    );
  }
});

class ActivityWithSpeed extends React.Component<any, any> {
  speedIncreaseInterval: any;

  constructor(props) {
    super(props);
    this.state = { speed: 3 };
  }

  componentDidMount() {
    this.speedIncreaseInterval = setInterval(
      () => this.setState({ speed: this.state.speed + 1 }),
      10000
    );
  }

  componentWillUnmount() {
    clearInterval(this.speedIncreaseInterval);
  }

  render() {
    const {
      data: { step }
    } = this.props;
    const { speed } = this.state;

    return (
      <React.Fragment>
        <div style={styles.text}>{texts.guidelines[step]}</div>
        <div style={{ display: 'flex' }}>
          {(step === 1 || step === 2 || step === 3) && (
            <Game {...this.props} width={500} height={400} speed={speed} />
          )}
          {(step === 0 || step === 2 || step === 3) && (
            <Symmetry {...this.props} width={200} height={300} speed={speed} />
          )}
        </div>
      </React.Fragment>
    );
  }
}

const Main = props => {
  const { data } = props;
  const { step } = data;

  if (step < 4) {
    return <Activity {...props} />;
  } else {
    return <div style={styles.text}>{texts.end}</div>;
  }
};

// the actual component that the student sees
const Runner = withStyles(styles)((props: ActivityRunnerPropsT) => {
  const { step } = props.data;
  const { classes, ...rest } = props;
  const p = Math.round((step / 4) * 100);
  return (
    <div style={styles.main}>
      <LinearProgress
        variant="determinate"
        value={p}
        classes={{
          root: classes.root,
          bar1Determinate: classes.bar1Determinate
        }}
      />
      {/* THIS DO NOT LABEL THE PROGRESS BAR */}
      <div style={styles.container}>
        <Main {...rest} />
      </div>
    </div>
  );
});

export default class ActivityRunner extends React.Component<
  ActivityRunnerPropsT
> {
  componentWillUnmount() {
    Mousetrap.reset();
    if (clearTimeout) {
      clearTimeout(delayTimeout);
    }
    if (noAnswerTimeout) {
      clearTimeout(noAnswerTimeout);
    }
  }

  render() {
    return this.props.data && <Runner {...this.props} />;
  }
}
