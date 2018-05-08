import React, { Component } from 'react';
import PDFJS from '@houshuang/pdfjs-dist';
import AnnotationLayer from './AnnotationLayer';

export default class PDF extends Component {
  constructor(props) {
    super(props);

    // this.onNextPage = this.onNextPage.bind(this)
    // this.onPrevPage = this.onPrevPage.bind(this)

    this.state = {
      pdf: null,
      pageNumber: 1,
      scale: 1
    };
  }

  componentDidMount() {
    PDFJS.getDocument(this.props.src).then(pdf => {
      // console.log(pdf)
      this.setState({ pdf });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.props, prevProps);
    if (this.props.src != prevProps.src) {
      PDFJS.getDocument(this.props.src).then(pdf => {
        console.log(pdf);
        this.setState({ pdf });
      });
    }
  }

  // onNextPage() {
  //   const { pageNumber, pdf } = this.state;
  //   if (pageNumber >= pdf.numPages) return;

  //   this.setState({
  //     pageNumber: pageNumber+1
  //   })
  // }

  // onPrevPage() {
  //   const { pageNumber } = this.state;
  //   if (pageNumber <= 1) return;

  //   this.setState({
  //     pageNumber: pageNumber-1
  //   })
  // }

  render() {
    if (!this.state.pdf) return null;

    const pdf = this.state.pdf;
    const numPages = pdf.pdfInfo.numPages;
    const fingerprint = pdf.pdfInfo.fingerprint;

    return (
      <div id="viewer" className="pdf-viewer">
        <AnnotationLayer
          pdf={pdf}
          userInfo={this.props.userInfo}
          data={this.props.data}
          dataFn={this.props.dataFn}
        />
      </div>
    );
  }
}
