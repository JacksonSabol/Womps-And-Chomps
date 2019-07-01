import React from "react";
import "./index.css";

// This Card component allows us to use a styled card for events with less syntax
export function EventCard(props) {
    return (
        <div>
            <div className="row">
                <div className="col-sm-12">
                    <div className="panel panel-primary">
                        <div className="panel-heading">
                            <h3 className="panel-title">
                                <strong><a href={props.link} className="article-link" rel="noopener noreferrer" target="_blank">{props.title}</a></strong>
                                <span className="published-date"> * {props.dateAndTime}</span>
                            </h3>
                        </div>
                        <div className="panel-body">
                            <table width="100%">
                                <tr className="table-row-list" width="100%">
                                    <td width="95%">
                                        {/* <div> */}
                                        {/* <img src={props.image} className="article-image"> */}
                                        <p>{props.fullTitle}</p>
                                        {/* </div> */}
                                    </td>
                                    <td width="5%" align="center">
                                        <button type="button" className="btn unsave-button" data-id={props._id}><span className="glyphicon glyphicon-remove">✗</span></button>
                                        <button type="button" className="btn view-notes" data-id={props._id}><span className="glyphicon glyphicon-comment"></span></button>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="container note-section" id={`note-toggle${props._id}}`> */}
            <section className="notes-well">
                <div className="row container-fluid panel-body">
                    <h4>Notes:</h4>
                    <span id={`existing-notes${props._id}`}></span>
                </div>
                <div className="row container-fluid panel-body">
                    <form className="note-form">
                        <div className="form-group">
                            <input type="text" id={`name-input${props._id}`} data-id={`${props._id}`} className="name-input" name="name" placeholder="Your Name" onfocus="this.placeholder = ''" />
                            <input type="text" id={`title-input${props._id}`} data-id={`${props._id}`} className="title-input" name="title" placeholder="Note Title" onfocus="this.placeholder = ''" />
                            <input type="text" id={`note-input${props._id}`} data-id={`${props._id}`} className="note-input" name="note" placeholder="What did you think of the event?" onfocus="this.placeholder = ''" />
                        </div>
                        <button className="btn post-note" data-id={`${props._id}`} type="button">Save Note</button>
                    </form>
                </div>
            </section>
            {/* </div> */}
        </div>
    );
}
