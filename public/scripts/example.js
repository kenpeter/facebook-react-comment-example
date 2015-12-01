
var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: "json",
      cache: false, 
      success: function(data) {
        // http://codereview.stackexchange.com/questions/49872/using-var-self-this-or-bindthis
        // Inside a function, scope has been changed.
        // Use bind to enforce scope.
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    comment.id = Date.now(); 
    var newComments = comments.concat([comment]);
    this.setState({data: newComments}); // So we already set state here, but later we, set it in $.ajax after success.

    $.ajax({
      url: this.props.url, // /api/comments
      dataType: "json",
      type: "POST",
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: comments}); // Keep original
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {data: []};
  },
 
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval)    
  },

  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});


var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment){
      return (
        <CommentNode author={comment.author} key={comment.id} text={comment.text} />
      );
    });


    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

// Diff
var CommentNode = React.createClass({
  render: function() {
    return (
      <Comment author={this.props.author}>
        {this.props.text}
      </Comment> 
    );
  }
});


var Comment = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div> 
    );
  }

});


var CommentForm = React.createClass({
  getInitialState: function() {
    return {author: '', text: ''};
  },

  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
 
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },

  handleSubmit: function(e) {
    // The form won't be sumitted here.
    e.preventDefault();

    var author = this.state.author;
    var text = this.state.text;

    if(!author || !text) {
      return;
    }

    this.props.onCommentSubmit({author: author, text: text});

    // I can create a local method, but I need to ask lots of info and borrow methods from
    // another component. Better use Flux and other framework. 
    //this.myHandleSubmit({author: author, text: text});    

    this.setState({author: "", text: ""});
  },

  /*
  myHandleSubmit: function(comment) {
    e.preventDefault();

  },
  */

  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Author"
          value={this.state.author}

          onChange={this.handleAuthorChange}

        />
        <br/>

        <input
          type="text"
          placeholder="Some text"
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <br/>

        <input type="submit" value="my submit" />
      </form> 
    );
  }

});

ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={2000} />,
  document.getElementById("content")
);
