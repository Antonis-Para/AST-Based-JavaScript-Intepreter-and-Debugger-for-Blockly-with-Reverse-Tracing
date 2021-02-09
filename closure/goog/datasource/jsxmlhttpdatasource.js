/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview
 * DataSource implementation that uses XMLHttpRequest as transport, with
 * response as valid JSON.
 *
 * Response can have unexecutable starting/ending text to prevent inclusion
 * using <script src="...">
 */


goog.provide('goog.ds.JsXmlHttpDataSource');

goog.require('goog.Uri');
goog.require('goog.ds.DataManager');
goog.require('goog.ds.FastDataNode');
goog.require('goog.ds.LoadState');
goog.require('goog.ds.logger');
goog.require('goog.events');
goog.require('goog.log');
goog.require('goog.net.EventType');
goog.require('goog.net.XhrIo');
goog.requireType('goog.events.Event');



/**
 * Similar to JsonDataSource, with using XMLHttpRequest for transport
 * Currently requires the result be a valid JSON.
 *
 * @param {(string|goog.Uri)} uri URI for the request.
 * @param {string} name Name of the datasource.
 * @param {string=} opt_startText Text to expect/strip before JS response.
 * @param {string=} opt_endText Text to expect/strip after JS response.
 * @param {boolean=} opt_usePost If true, use POST. Defaults to false (GET).
 *
 * @extends {goog.ds.FastDataNode}
 * @constructor
 * @final
 */
goog.ds.JsXmlHttpDataSource = function(
    uri, name, opt_startText, opt_endText, opt_usePost) {
  'use strict';
  goog.ds.FastDataNode.call(this, {}, name, null);
  if (uri) {
    this.uri_ = new goog.Uri(uri);
    this.xhr_ = new goog.net.XhrIo();
    this.usePost_ = !!opt_usePost;

    goog.events.listen(
        this.xhr_, goog.net.EventType.COMPLETE, this.completed_, false, this);
  } else {
    this.uri_ = null;
  }
  this.startText_ = opt_startText;
  this.endText_ = opt_endText;
};
goog.inherits(goog.ds.JsXmlHttpDataSource, goog.ds.FastDataNode);


/**
 * Delimiter for start of JSON data in response.
 * null = starts at first character of response
 * @type {string|undefined}
 * @private
 */
goog.ds.JsXmlHttpDataSource.prototype.startText_;


/**
 * Delimiter for end of JSON data in response.
 * null = ends at last character of response
 * @type {string|undefined}
 * @private
 */
goog.ds.JsXmlHttpDataSource.prototype.endText_;


/**
 * Gets the state of the backing data for this node
 * @return {goog.ds.LoadState} The state.
 * @override
 */
goog.ds.JsXmlHttpDataSource.prototype.getLoadState = function() {
  'use strict';
  return this.loadState_;
};


/**
 * Sets the request data. This can be used if it is required to
 * send a specific body rather than build the body from the query
 * parameters. Only used in POST requests.
 * @param {string} data The data to send in the request body.
 */
goog.ds.JsXmlHttpDataSource.prototype.setQueryData = function(data) {
  'use strict';
  this.queryData_ = data;
};


/**
 * Load or reload the backing data for this node.
 * Fires the JsonDataSource
 * @override
 */
goog.ds.JsXmlHttpDataSource.prototype.load = function() {
  'use strict';
  goog.log.info(
      goog.ds.logger,
      'Sending JS request for DataSource ' + this.getDataName() + ' to ' +
          this.uri_);

  if (this.uri_) {
    if (this.usePost_) {
      var queryData;
      if (!this.queryData_) {
        queryData = this.uri_.getQueryData().toString();
      } else {
        queryData = this.queryData_;
      }

      var uriNoQuery = this.uri_.clone();
      uriNoQuery.setQueryData(null);
      this.xhr_.send(String(uriNoQuery), 'POST', queryData);
    } else {
      this.xhr_.send(String(this.uri_));
    }
  } else {
    this.loadState_ = goog.ds.LoadState.NOT_LOADED;
  }
};


/**
 * Called on successful request.
 * @private
 */
goog.ds.JsXmlHttpDataSource.prototype.success_ = function() {
  'use strict';
  goog.ds.DataManager.getInstance().fireDataChange(this.getDataName());
};


/**
 * Completed callback. Loads data if successful, otherwise sets
 * state to FAILED
 * @param {goog.events.Event} e Event object, Xhr is target.
 * @private
 */
goog.ds.JsXmlHttpDataSource.prototype.completed_ = function(e) {
  'use strict';
  if (this.xhr_.isSuccess()) {
    goog.log.info(
        goog.ds.logger, 'Got data for DataSource ' + this.getDataName());
    var text = this.xhr_.getResponseText();

    // Look for start and end token and trim text
    if (this.startText_) {
      var startpos = text.indexOf(this.startText_);
      text = text.substring(startpos + this.startText_.length);
    }
    if (this.endText_) {
      var endpos = text.lastIndexOf(this.endText_);
      text = text.substring(0, endpos);
    }

    // Parse result.

    try {
      var jsonObj = /** @type {!Object} */ (JSON.parse(text));
      this.extendWith(jsonObj);
      this.loadState_ = goog.ds.LoadState.LOADED;
    } catch (ex) {
      // Invalid JSON.
      this.loadState_ = goog.ds.LoadState.FAILED;
      goog.log.error(goog.ds.logger, 'Failed to parse data: ' + ex.message);
    }

    // Call on a timer to avoid threading issues on IE.
    goog.global.setTimeout(goog.bind(this.success_, this), 0);
  } else {
    goog.log.info(
        goog.ds.logger,
        'Data retrieve failed for DataSource ' + this.getDataName());
    this.loadState_ = goog.ds.LoadState.FAILED;
  }
};
