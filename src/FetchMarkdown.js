import React from "react";
import Markdown from "markdown-to-jsx";

export default class FetchMarkdown extends React.Component {
  render() {
    return <Markdown>{this.props.input}</Markdown>;
  }
}
