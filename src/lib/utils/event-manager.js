var EventManager = function(configuration){
	this.emitter = new process.EventEmitter();

	if(EventManager.caller != EventManager.getInstance){
		throw new Error("This object cannot be instanciated");
	}
}

EventManager.instance = null;

EventManager.getInstance = function(){
	if(this.instance === null){
		this.instance = new EventManager();
	}
	return this.instance;
};

EventManager.prototype = {
	subscribe : function(eventName,onEvent){
		this.emitter.on(eventName,onEvent);
	},

	unsubscribe : function(eventName){
		this.emitter.removeAllListeners(eventName);
	},

	publish : function(){
		this.emitter.emit.apply(this.emitter,arguments);
	}
}

exports = module.exports = EventManager.getInstance();
