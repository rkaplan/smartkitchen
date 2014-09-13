(function() {
  "use strict";

  var async = require('async'),
      _     = require('underscore'),
      conf  = require('nconf').argv().env().file({file: __dirname + '/../config.json'}),

      prep, renderView, getName, getView, getSubctrls, doPrePrep, doPrep, doPostPrep,
      addBlocks, addStyles, addScripts,
      apiPrep, renderData,

      getProto,
      _protoSet;

  getName     = function get_name()     { return this._name };
  getView     = function get_view()     { return this._view };
  getSubctrls = function get_subctrls() { return this._subctrls };



  prep = function base_ctrl_prep( res, req_data, blocks, cb ) {
    var self      = this,
        data      = _.extend(this.payload, req_data);

    // add the name to the data
    data.routeName = self.getName();
    async.series([
      function(cb) { doPrePrep(data, self, cb); },
      function(cb) { addBlocks(data, blocks, cb); },
      function(cb) { doPrep(data, res, self, false, cb); },
      function(cb) { doPostPrep(data, self, cb); }
    ], function(err){
      if (err){
        return cb(err);
      }
      cb(null, data);
    });
  };

  apiPrep = function(res, req_data, cb){
    var self = this,
        data = _.extend(this.payload, req_data);

    if (!data){ data = {} }
    async.series([
      function(cb){ doPrePrep(data, self, cb); },
      function(cb){ doPrep(data, res, self, true, cb); },
      function(cb){ doPostPrep(data, self, cb); }
    ], function(err){
      if (err){
        return cb(err);
      }
      cb(null, data);
    });
  };

  doPrePrep = function(data, self, cb){
    if (typeof self.prePrep === "function"){
      self.prePrep(data, cb);
    }else{
      cb();
    }
  };

  doPrep = function(data, res, self, api, cb){
    var parallels = {},
        subctrls  = self.getSubctrls();

    if( _.isArray( subctrls ) ) {
      // build the first param to async parallels as name of subview : instance
      // this gets merged into render data so any subview can be
      // inserted into hbs by its controller name
      _.each( subctrls, function( subctrl ) {
        if( ! parallels[ subctrl.getName() ] ) { //ignore dup subviews
          parallels[ subctrl.getName() ] = function( par_cb ) {
            subctrl.renderView( res, data, {}, par_cb );
          };
        }
      });

      return async.parallel( parallels, function( err, results ) {
        _.extend( data, results );
        cb( null, data );
      });
    }
    if (!api){
      data.loggedIn = res.loggedIn;
      data.admin    = res.admin;
    }
    cb( null, data ); //else no subctrls, just move along
  };

  doPostPrep = function(data, self, cb){
    if (typeof self.postPrep === "function"){
      self.postPrep(data, cb);
    }else{
      cb();
    }
  };

  renderView = function base_ctrl_render_view( res, data, blocks, cb ) {
    var self = this;
    this.prep( res, data, blocks, function( err, final_data ) {
      if (err){
        console.log("prep error", err);
        if (_.has(err, "statusCode")){
          return res.render("errors/" + err.statusCode, _.extend(data, {status: err.statusCode, title: String(err.statusCode)}));
        }
        res.render("errors/500", _.extend(data, {status: 500, title: "500"}));
        return;
      }
      self.getView().render( res, final_data, cb );
    });
  };

  renderData = function(res, data, cb){
    var self = this;
    this.prep(res, data, function(err, final_data){
      if(err){
        console.log("prep error", err);
        var errorCode = err.statusCode || 500;
        return res.send(errorCode, final_data);
      }
      return res.send(final_data);
    });
  };

  _protoSet = {
    std : { prep : prep, getName : getName, getSubctrls : getSubctrls,
            getView : getView, renderView : renderView },
    api: { prep: apiPrep, getName: getName, getSubctrls: getSubctrls,
           renderData: renderData}
  };
  getProto = function get_proto( type ) {
    return _.clone( _protoSet[ type ] );
  };

  addBlocks = function(params, block, cb){
    params.scripts = addScripts(block.scripts);
    params.styles  = addStyles(block.styles);
    cb();
  };

  // block rendering
  addStyles = function(styles){
    if (typeof styles === "undefined"){
      // no styles
      return;
    }
    var stylesString = "";
    for (var i = 0; i < styles.length; i++){
      stylesString += "<link rel=\"stylesheet\" href=\"/stylesheets/" + styles[i] + "\" />";
    }
    return stylesString;
  };

  // takes the script names and add script tags
  addScripts = function(scripts){
    if (typeof scripts === "undefined"){
      // no scripts
      return;
    }
    var scriptsString = "";
    for (var i = 0; i < scripts.length; i++){
      scriptsString += "<script type=\"text/javascript\" src=\"/javascripts/" + scripts[i] + "\"></script>";
    }
    return scriptsString;
  };

  module.exports = {
    prep        : prep,
    renderView  : renderView,
    getName     : getName,
    getSubctrls : getSubctrls,
    getProto    : getProto
  };
}());
