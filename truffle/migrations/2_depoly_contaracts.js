const ServiceRegistry = artifacts.require("../build/contracts/ServiceRegistry");

module.exports = function(deployer) {
  deployer.deploy(ServiceRegistry);
};
