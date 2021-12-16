const Web3 = require("web3");
const endpoint = 'ws://203.250.77.150:8546'
const acc = '0x3f243FdacE01Cfd9719f7359c94BA11361f32471';
const provider = new Web3.providers.WebsocketProvider(endpoint);
const web3 = new Web3(provider);

const abi = require('../current-deploy-contract/abi-registry.json');
const address = '0x6012df3B6ac7D377322AF716d6FdA435d7C95Fb4';
const serviceRegistry = new web3.eth.Contract(abi, address, {
    from: acc,
    gas: 2000000,
    gasPrice: 1
});



const encrpString = 'ef8a78f289f7b68f30fd556b06c9cc6203a60737cf13280186fa7b30af5a6327e570c3c57061157a608b3cb90dd4f82c2c1dc2de4a9d091284024ac6ab7c6510cffceb9854e3fdf438bb3dbeff41c4e75ad0c3a65ef8bf2e87a55a81ce41c9c6422c048e9a4583b7c08916af34750195d9eeeee701b73825ba69d1cf8bf83382c4fee8ae4b5e77010f11f43b6895ac35c2eda0b6acf06003509131fc02f09f909025cdb98f8e1f86ab16a752b6e7ed8fe2b342447163184da1c9db07dd16d84efb531db1397eacbb5b9e8ef25a2a4c8c2044b3bbd7e375973cfb259a428d63a3c1509ec797a7848be09406d847bdf219570a51ad7a469d96d870f6283c2d8d1d197f13f14c309bd1855aa259f6a313a745b8eb6f942c3eb58349bf38efe68f5f3b9c4b2991e0abf156294a00902b12e95c43a214643b02ad70621f7a8c9d24824efe10857329f2fa124e617171e73692f85d019a26d3962fb1f7376da57ed72695b60c0b7c507b43e4c4de6c0c1222885968d75caa41365ad7cd905ee2deff91d7197afec0de33d57bfb76d38cec5377f22397cfc17269400041b2f658e6ae56cb16349f049db27390f5c3c94fc61990e52ed25a2fcf7ff822ca64bf8971f178f34adb2ee3c0ffddf51f7b0bedced9f63602497e35b4c7ca4da842329f5d883aaf11e17de1350ca9621b8431ffa987ff4cc710375f5f5961d2834d3a6390da5799b7c8b84ec8f5685f6d8a0910ad98a685a5d41d2c14bb5353d574c97ba242006054d50135b01ba21d59b09f48361a8949bfb189647b083acb1ff09e3116bc3452e2c94c39f7f8b15801c0edf058a3da0338fcd32b17b85005c864c3cd351cd646834bb3bc545fa1e3266ba054d52994c13cae10527530a19ed9286d5ff8a92f387c10b8369c914d73242b9179968d9719bb6d7d69e92c083935f3e5f793692da1e121f285e18d943bdf9415ea52e5a31d331fc5fe55f8b878f4840f60d0465ed58fc2b7a86e354bcc8be3cfda35eeb834f524b3b825f2be57b33cdbe023594e7bf46e6ca29a3faed478f03868abd9215114dfeb4bb849fc82dd2c2116ef92e5d2b3341a5dad72e95bb0966e191d3e4d049c9352f88bb50e590c33b0c8c5b2262dc7f5f1542ee2f9f885f85156123dce1b6919bcdff4f6777f41baba699fdbd5b1'

async function test(){

    //console.log(obj.abi)
    
    const password = '1234';
    // const option = {
    //     from: acc,
    //     gas: 2000000,
    //     gasPrice: 1,
    // };
    await web3.eth.personal.unlockAccount(acc, password);
    const service = _makeService();

    await serviceRegistry.methods.register(service).send();
    //await serviceRegistry.methods.backupLog('test', encrpString).send(option);
    console.log("@")
}
//test()

async function getService(){
    const password = '1234';
   // await web3.eth.personal.unlockAccount(acc, password);
    //const scv = await serviceRegistry.methods.getLatestBackupLog('test-app').call(option);
    const scv = await serviceRegistry.methods.getService('t1').call()
    console.log(scv);
}
getService();



async function getLatestStateVersion(){
    const password = '1234';
   // await web3.eth.personal.unlockAccount(acc, password);
    //const scv = await serviceRegistry.methods.getLatestBackupLog('test-app').call(option);
    const scv = await serviceRegistry.methods.getService('test-1').call({from: acc})
    const stateVersion = scv.backup.logs.length+1;
    console.log(stateVersion);
}
//getLatestStateVersion();



//////////////////////////////////////////////////////////////
function _makeService(){
    const kubecontext = _makeKubeContext();
    const container = _makeContainer();
    const STATE_READY = 1;
    const NOT_RUNNING_LOCATION = 999;
    const EMPTY_START_TIME = 0;
    const EMPTY_END_TIME = 0;
    const EMPTY_REPLICAS = 0;

    let service = new Array;
    service.push(
      _makeHeader(),
      _makeRuntime(kubecontext, container),
      _makeBackup(),
      STATE_READY,
      EMPTY_REPLICAS,  //v2_service-registry        
      NOT_RUNNING_LOCATION,
      EMPTY_START_TIME,
      EMPTY_END_TIME
    );
    return service
}

function _makeHeader(){
    let header =new Array;
    header.push(
        'test-1',
        acc,
        acc,
        'pslab',
        'alsgh@gmail.com',
        '01040658361',
        'app is test',
    )
    return header;
}

function _makeKubeContext(){
    let kubeContext = new Array;
    kubeContext.push(
        [],
        'accessToken',
        'node-id',
        'network-id',
        'http',
        ['192.168.205.10','192.168.205.11','192.168.205.12','192.168.205.13','192.168.205.14','192.168.205.15','192.168.205.16'],
        '3000',
        'node-mount-service',
        'node-mount-etcd',
        'secret'
    )
    return kubeContext;
}

function _makeContainer(){
    let container = new Array;
    container.push(
        'image',
        'image-access-user',
    )
    return container;
}

function  _makeRuntime(kubecontext, container){
    let runtime = new Array;
    runtime.push(
        container,
        kubecontext
    )
    return runtime;
}

function _makeBackup(){
    return [[]];
}
