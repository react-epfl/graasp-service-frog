import { uuid } from 'frog-utils';
import { Graphs } from '/imports/api/graphs';
import { LibraryStates } from './cache';
import { graphToString, doImportGraph } from '../ui/GraphEditor/utils/export';

const RemoteServer =
  Meteor.settings.public.remoteServer ||
  'https://icchilisrv4.epfl.ch:5500/graphs';

export const removeGraph = (id: string, callback: ?Function) => {
  fetch(RemoteServer + '?uuid=eq.' + id, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ deleted: true })
  }).then(() => collectGraphs(callback));
};

export const updateGraph = (id: string, graph: Object, callback: ?Function) => {
  fetch(RemoteServer + '?uuid=eq.' + id, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ graph: graphToString(graph) })
  }).then(() => collectGraphs(callback));
};

export const loadGraphMetaData = (id: string, callback: ?Function) => {
  fetch(RemoteServer + '?uuid=eq.' + id)
    .then(e => e.json())
    .then(e => {
      if (LibraryStates.graphList.filter(x => x.uuid === id).length > 0) {
        LibraryStates.graphList.filter(x => x.uuid === id)[0] = {
          uuid: id,
          title: e[0].title,
          description: e[0].description,
          tags: e[0].tags
        };
      } else
        LibraryStates.graphList.push({
          uuid: id,
          title: e[0].title,
          description: e[0].description,
          tags: e[0].tags
        });
      if (callback) {
        callback();
      }
    });
};

export const refreshGraphDate = () =>
  (LibraryStates.lastRefreshGraph = new Date());

export const collectGraphs = (callback: ?Function) =>
  fetch(RemoteServer + '?select=uuid,title,description,tags,timestamp,deleted')
    .then(e => e.json())
    .then(r => {
      LibraryStates.graphList = r.filter(x => !x.deleted);
      refreshGraphDate();
      if (callback) callback();
    });

export const checkDateGraph = (callback: ?Function) => {
  if (
    !LibraryStates.lastRefreshGraph ||
    new Date() - LibraryStates.lastRefreshGraph > 60000
  ) {
    collectGraphs(callback);
  }
};

export const sendGraph = (state: Object, props: Object) => {
  const newId = uuid();
  const graph = {
    title: state.title,
    description: state.description,
    tags: '{' + state.tags.join(',') + '}',
    parent_id: Graphs.findOne(props.graphId).parentId,
    uuid: newId,
    graph: graphToString(props.graphId)
  };
  fetch(RemoteServer, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(graph)
  });
  Graphs.update(props.graphId, {
    $set: { parentId: newId }
  });
  LibraryStates.graphList.push({
    uuid: newId,
    title: state.title,
    description: state.description,
    tags: state.tags,
    timestamp: new Date()
  });
};

export const importGraph = (id: string) => {
  fetch(RemoteServer + '?uuid=eq.' + id)
    .then(e => e.json())
    .then(e => {
      const graphId = doImportGraph(e[0].graph);
      Graphs.update({ _id: graphId }, { $set: { parentId: id } });
    });
};
