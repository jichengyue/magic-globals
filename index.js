/**
 * MAGIC GLOBALS
 * https://github.com/gavinengel/magic-globals
 */

/** begin setting magic properties into global (required for other functions) */

/**
 * 因为调用Error.prepareStackTrace,会耗费Nodejs的性能，所以只是在
 * debug模式下才调用Error.prepareStackTrace,在非debug模式情况下调用不起效果
 */
var DEBUG_MODEL="debug";
var PRODUCTION_MODEL="production";
var GLOBAL_MODEL = "debug";

/**
 * 尽量不要调用__stack,会耗费NODE的性能
 */
Object.defineProperty(global, '__stack', {
  get: function(){
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack){ return stack; };
    var err = new Error;
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  }
});

/** returns line number when placing this in your code: __line */
Object.defineProperty(global, '__line', {
  get: function(){
    if(GLOBAL_MODEL != DEBUG_MODEL) return "";
    return __stack[1].getLineNumber();
  }
});

/** return filename (without directory path or file extension) when placing this in your code: __file */
Object.defineProperty(global, '__file', {
  get: function(){
    if(GLOBAL_MODEL != DEBUG_MODEL) return "";
    return __stack[1].getFileName().split('/').slice(-1)[0].split('.').slice(0)[0];
  }
});

/** return file extension (without preceding period) when placing this in your code: __ext */
Object.defineProperty(global, '__ext', {
  get: function(){
    if(GLOBAL_MODEL != DEBUG_MODEL) return "";
    return __stack[1].getFileName().split('.').slice(-1)[0];
  }
});

/**
 * return current function
 * @source https://gist.github.com/lordvlad/ec81834ddff73aaa1ab0
 */
Object.defineProperty(global, '__func', {
    get: function(){
        return arguments.callee.caller && arguments.callee.caller.name || '(anonymous)';
    }
});

/** return base path of project */ 
Object.defineProperty(global, '__base', {
  get: function(){
    return process.cwd(); 
  }
});

/** returns filename, a colon, and line number when placing this in your code: __fili */
Object.defineProperty(global, '__fili', {
  get: function(){
    if(GLOBAL_MODEL != DEBUG_MODEL) return "";
    filid = ':';
    if ( typeof GLOBAL.__filid !== 'undefined' && GLOBAL.__filid )
    {
      filid = GLOBAL.__filid;
    }

    return __stack[1].getFileName() + filid + __stack[1].getLineNumber();
  }
});

/**
 * MODEL is debug or production
 * @param MODEL
 */
exports.setModel = function (MODEL) {
  if(DEBUG_MODEL != MODEL && PRODUCTION_MODEL != MODEL){
    throw new Error("MODEL must debug or production");
  }else{
    GLOBAL_MODEL = MODEL;
  }
};

exports.DEBUG_MODEL = DEBUG_MODEL;
exports.PRODUCTION_MODEL = PRODUCTION_MODEL;