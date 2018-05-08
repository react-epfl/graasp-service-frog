// @flow
import React, { Component } from 'react';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.

import { sendActivity, updateActivity } from '/imports/api/remoteActivities';
import { sendGraph, updateGraph } from '/imports/api/remoteGraphs';
import { Graphs } from '/imports/api/graphs';

type StateT = {
  title: string,
  description: string,
  tags: Array<string>
};

export default class ExportModal extends Component<Object, StateT> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: '',
      description: '',
      tags: []
    };
  }

  componentWillReceiveProps(nextProps: Object) {
    if (nextProps.metaDatas)
      this.setState({
        ...nextProps.metaDatas[0]
      });
    else {
      const name = nextProps.activity
        ? nextProps.activity.title
        : Graphs.findOne({ _id: nextProps.graphId }).name;
      this.setState({
        title: name
      });
    }
  }

  render() {
    return (
      <Dialog open={this.props.modalOpen}>
        <DialogTitle>
          {'Export ' + this.props.exportType + ' to the Server:'}
        </DialogTitle>
        <DialogContent>
          <h3>Title</h3>
          <TextField
            defaultValue={this.state.title}
            onChange={e => this.setState({ title: e.target.value })}
            name="title"
          />
          <h3>Description</h3>
          <TextField
            value={this.state.description}
            multiline
            onChange={e => this.setState({ description: e.target.value })}
            id="exampleFormControlTextarea1"
            rows="3"
          />
          <div style={{ height: '20px' }} />
          <TagsInput
            value={this.state.tags}
            onChange={t => this.setState({ tags: t })}
          />
          <div style={{ height: '10px' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.setModal(false)}>Cancel</Button>
          <Button
            color="primary"
            onClick={() => {
              if (this.props.exportType === 'activity') {
                sendActivity(this.state, this.props);
                this.props.setModal(false);
              } else if (this.props.exportType === 'graph') {
                sendGraph(this.state, this.props);
                this.props.setModal(false);
              }
              if (this.props.madeChanges) this.props.madeChanges();
              this.setState({
                title: '',
                description: '',
                tags: []
              });
            }}
            disabled={Boolean(!this.state.title || !this.state.description)}
          >
            Save
          </Button>
          {((this.props.activity && this.props.activity.parentId) ||
            (this.props.exportType === 'graph' &&
              Graphs.findOne(this.props.graphId).parentId)) && (
            <Button
              color="primary"
              onClick={() => {
                if (this.props.exportType === 'activity') {
                  updateActivity(
                    this.props.activity.parentId,
                    {
                      ...this.props.activity,
                      ...this.state
                    },
                    () => this.props.setModal(false)
                  );
                } else if (this.props.exportType === 'graph')
                  updateGraph(
                    Graphs.findOne(this.props.graphId).parentId,
                    this.props.graphId,
                    () => this.props.setModal(false)
                  );
                if (this.props.madeChanges) this.props.madeChanges();
                this.setState({
                  title: '',
                  description: '',
                  tags: []
                });
              }}
              disabled={Boolean(!this.state.title || !this.state.description)}
            >
              Overwrite parent
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}
