

var etl = function() {

}

etl.instance = null;
etl.getInstance = function() {
  if (this.instance === null) {
    this.instance = new etl();
  }
  return this.instance;
};



exports = module.exports = etl.getInstance();
