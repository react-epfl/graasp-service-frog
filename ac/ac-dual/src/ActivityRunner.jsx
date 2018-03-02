// @flow

import * as React from 'react';
import { type ActivityRunnerT, TimedComponent } from 'frog-utils';
import { ProgressBar, Button } from 'react-bootstrap';
import { withState } from 'recompose';
import Mousetrap from 'mousetrap';
import Canvas from './Canvas';

const styles = {
  button: { width: '90px', margin: 'auto', position: 'absolute' },
  text: { width: '100%', fontSize: 'xx-large', textAlign: 'center' },
  guidelines: { width: '100%' },
  container: {
    width: '500px',
    height: '400px',
    margin: 'auto',
    marginTop: '80px'
  },
  main: {
    width: '100%',
    height: '100%',
    backgroundColor: '#bbb',
    position: 'absolute'
  },
  commands: {
    width: '250px',
    height: '50px',
    margin: 'auto',
    position: 'relative',
    marginTop: '50px'
  }
};

const FIGURE = {
  complexity: 0.5,
  complexity_diff: 0.5,
  symmetrical: false
};

const texts = {
  en: {
    start: 'Start',
    yes: 'YES',
    no: 'NO',
    question: 'Are they symmetrical?',
    wait: 'Waiting for next question',
    end: 'Activity completed! Thank you'
  },
  fr: {
    start: 'Commencer',
    yes: 'OUI',
    no: 'NON',
    question: 'Sont-ils symétriques?',
    wait: 'Attendez la question suivante',
    end: 'Activité terminée! Merci'
  }
};

let noAnswerTimeout;
let delayTimeout;

const Form = withState('language', 'setLanguage', null)(
  ({ language, setLanguage, onSubmit, name }) => (
    <React.Fragment>
      <div style={styles.text}>Welcome {name}!</div>
      <div style={styles.text}>Choisis ton langage</div>
      <div style={styles.text}>Choose your language</div>
      <div style={styles.commands}>
        <Button
          style={{ ...styles.button, left: 0 }}
          bsStyle={language === 'fr' ? 'success' : 'default'}
          onClick={() => setLanguage('fr')}
        >
          Français
        </Button>
        <Button
          style={{ ...styles.button, right: 0 }}
          bsStyle={language === 'en' ? 'success' : 'default'}
          onClick={() => setLanguage('en')}
        >
          English
        </Button>
      </div>
      {language !== null && (
        <div style={{ ...styles.commands, width: '100px' }}>
          <Button
            style={{ ...styles.button, width: '100%' }}
            onClick={() => onSubmit(language)}
            bsStyle="primary"
          >
            Submit
          </Button>
        </div>
      )}
    </React.Fragment>
  )
);

const Guidelines = ({ start, guidelines, lang }) => (
  <React.Fragment>
    <div style={styles.guidelines}>{guidelines}</div>
    <div style={{ ...styles.commands, width: '120px' }}>
      <Button style={{ ...styles.button, width: '100%' }} onClick={start}>
        {texts[lang].start}
      </Button>
    </div>
  </React.Fragment>
);

const CountDownTimer = TimedComponent(({ timeNow, length, start }) => {
  const timeLeft = Math.ceil((length - Math.ceil(timeNow - start)) / 1000);
  return <div style={styles.text}>{timeLeft + ' s'}</div>;
}, 100);

const Delay = ({ next, delay, lang }) => {
  clearTimeout(delayTimeout);
  delayTimeout = setTimeout(next, delay);
  return (
    <React.Fragment>
      <div style={styles.text}>{texts[lang].wait}</div>
      <CountDownTimer start={Date.now()} length={delay} />
    </React.Fragment>
  );
};

const randSymmetry = figure => {
  figure.symmetrical = Math.random() < 0.5;
  return figure;
};

const Question = props => {
  const { setQuestion, startTime, logger, data, dataFn, activityData } = props;
  const lang = data.language;

  const onClick = answer => () => {
    clearTimeout(noAnswerTimeout);
    // Logs the question and answer provided
    const answerTime = Date.now();
    // Increases the progress and logs the new progress
    dataFn.numIncr(1, 'progress');
    // Increases the score and logs the new score
    const isCorrectAnswer = FIGURE.symmetrical === answer ? 1 : 0;
    const timeIncr = Date.now() - startTime;
    const value = [data.score + isCorrectAnswer, -(data.time + timeIncr)];
    logger([
      { type: 'answer', payload: { answer, answerTime } },
      {
        type: 'progress',
        value: (data.progress + 1) / activityData.config.maxQuestions
      },
      { type: 'score', value }
    ]);
    dataFn.numIncr(isCorrectAnswer, 'score');
    dataFn.numIncr(timeIncr, 'time');
    // Goes on to next question
    setQuestion('waiting');
    Mousetrap.reset();
  };

  Mousetrap.bind('y', onClick(true));
  Mousetrap.bind('o', onClick(true));
  Mousetrap.bind('n', onClick(false));

  clearTimeout(noAnswerTimeout);
  noAnswerTimeout = setTimeout(onClick(undefined), activityData.config.maxTime);

  return (
    <React.Fragment>
      <div style={styles.text}>
        <Canvas figure={randSymmetry(FIGURE)} />
        {texts[lang].question}
      </div>
      <div style={styles.commands}>
        <Button style={{ ...styles.button, left: 0 }} onClick={onClick(true)}>
          {texts[lang].yes}
        </Button>
        <Button style={{ ...styles.button, right: 0 }} onClick={onClick(false)}>
          {texts[lang].no}
        </Button>
      </div>
      <CountDownTimer start={Date.now()} length={activityData.config.maxTime} />
    </React.Fragment>
  );
};

const Main = withState('question', 'setQuestion', null)(props => {
  const { activityData, question, setQuestion, data, dataFn } = props;
  const { maxQuestions, delay } = activityData.config;
  const lang = data.language;
  const { name } = props.userInfo;
  if (!lang) {
    return <Form onSubmit={l => dataFn.objInsert(l, 'language')} name={name} />;
  } else if (question === null) {
    const start = () => setQuestion('waiting');
    const { guidelines } = activityData.config[lang];
    return <Guidelines start={start} guidelines={guidelines} lang={lang} />;
  } else if (question === 'waiting') {
    const next = () => {
      setQuestion({ startTime: Date.now() });
    };
    return <Delay next={next} delay={delay} props={props} lang={lang} />;
  } else if (data.progress < maxQuestions) {
    return <Question {...props} />;
  } else {
    return <div style={styles.text}>{texts[lang].end}</div>;
  }
});

// the actual component that the student sees
const Runner = (props: ActivityRunnerT) => {
  const { data, activityData } = props;
  const { maxQuestions } = activityData.config;
  const p = Math.round(data.progress / maxQuestions * 100);
  return (
    <div style={styles.main}>
      <ProgressBar now={p} label={`${p}%`} />
      <div style={styles.container}>
        <Main {...props} />
      </div>
    </div>
  );
};

export default class ActivityRunner extends React.Component<ActivityRunnerT> {
  componentWillUnmount() {
    Mousetrap.reset();
    clearTimeout(delayTimeout);
    clearTimeout(noAnswerTimeout);
  }

  render() {
    return this.props.data && <Runner {...this.props} />;
  }
}