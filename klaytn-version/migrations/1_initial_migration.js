const Migrations = artifacts.require("./Migrations.sol");
const ServiceRegistry = artifacts.require("./ServiceRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(ServiceRegistry);
};
