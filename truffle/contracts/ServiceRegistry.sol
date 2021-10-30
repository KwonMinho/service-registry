pragma solidity >=0.4.22 <0.9.0;
pragma abicoder v2;

contract ServiceRegistry {

    enum State { Null, Ready, Running, Stop }

    struct Header{
        string id;
        address manager;
        address serviceAccount;
        string companyName;
        string companyEmail;
        string companyContact;
        string description;
    }

    
    struct KubeContext{
        string[] location;
        string accessToken;
        string nodeID;
        string networkID;
        string serviceProtocol;
        string[] servicePoints;
        string servicePort;
        string nodeMountService;
        string nodeMountETCD;
        string secret;  //v2
    }

    struct Container{
        string image;
        string imageAccessUser;
    }
    
    struct Runtime{
        Container ct;
        KubeContext kct;
    }

    //v3
    struct Backup{
        string[] logs;
    }
    
    struct Service{
        Header header;
        Runtime runtime;
        Backup backup; //v3
        State state;
        uint256 curReplicas;
        uint256 serviceLocationIndex;
        uint256 serviceStartTime;
        uint256 serviceEndTime;
    }
    
    event ChangeService(string serviceID, string changeType);
    event NewService(string serviceID);
    
    mapping (string => Service) services;
    mapping (address => string[]) managerServiceList; // string[]: array of service name 
    
    
    modifier onlyManager(string memory id){
        require(services[id].header.manager == msg.sender, "Not authorized");
        _;
    }

    
    modifier onlyServiceAccount(string memory id){
        require(services[id].header.serviceAccount == msg.sender, "Not authorized");
        _;
    }
    
    modifier hasNotService(Service memory service){
        string memory id = service.header.id;
        require(services[id].state == State.Null, "Already registered");
        _;
    }
    
    modifier hasService(string memory serviceID){
        require(services[serviceID].state != State.Null, "Service does not exist");
        _;
    }

    modifier isRunning(string memory serviceID){
        require(services[serviceID].state == State.Running, "It's not running");
        _;
    }
    

    /* Manager service list*/
    function getServiceList()
    public view returns(string[] memory)
    {
        return managerServiceList[msg.sender];
    }


    /* Service Manager */
    function register(Service memory service) 
    public hasNotService(service)
    {
        string memory id = service.header.id;
        services[id] = service;
        managerServiceList[service.header.manager].push(id);
        emit NewService(id);
    }

    /* Service Manager-v2 */
    function startService(string memory id, string memory secret ,uint256 replicas)
    public onlyManager(id)
    {
        services[id].state = State.Running;
        services[id].serviceStartTime = block.timestamp;
        services[id].runtime.kct.secret = secret;
        services[id].curReplicas = replicas;
        emit ChangeService(id, "SERVICE_START");
    }

    /* Service Manager-v2 */
    function updateReplicas(string memory id, uint256 replicas)
    public onlyManager(id)
    {
        services[id].curReplicas = replicas;
        emit ChangeService(id, "SERVICE_REPLICAS");
    }

    
    /* Service Manager */
    function getService(string memory id) 
    public view onlyManager(id)
    returns (Service memory service)
    {
        return services[id];
    }    
    
    /* Service Manager */
    function updateKubeContext(string memory id, KubeContext memory kubeContext) 
    public onlyManager(id)
    {
        services[id].runtime.kct = kubeContext;
        emit ChangeService(id, "SERVICE_KUBECONTEXT");
    }
    
    /* Service Manager */
    function updateContainer(string memory id, Container memory container) 
    public onlyManager(id)
    {
        services[id].runtime.ct = container;
        emit ChangeService(id, "SERVICE_CONTAINER");
    }

    /* Service Manager-v2 */
    function pauseService(string memory id)
    public onlyManager(id)
    {  
        services[id].state = State.Ready;
        services[id].curReplicas = 0;
        emit ChangeService(id, "SERVICE_PAUSE"); 
    }
    
    /* Service Manager */
    function stopService(string memory id) 
    public onlyManager(id)
    {
        services[id].state = State.Stop;
        services[id].serviceEndTime = block.timestamp;
        emit ChangeService(id, "SERVICE_STOP");
    }

    /* Leader Service-v3 */
    function backupLog(string memory id, string memory log)
    public onlyServiceAccount(id)
    {
        services[id].backup.logs.push(log);
        emit ChangeService(id, "SERVICE_STATE_BACKUP");
    }

    /* Leader, Follower Service-v3 */
    function getLatestBackupLog(string memory id)
    public view onlyServiceAccount(id)
    returns (string memory log)
    {
        uint index = services[id].backup.logs.length;
        if(index == 0) return "empty";
        else return services[id].backup.logs[index-1];
    }
    
    /* v3 */
    function getAllBackupKey(string memory id)
    public view onlyManager(id)
    returns (string[] memory logs)
    {
        return services[id].backup.logs;
    }    
    
    
    /* Leader Service-v2 */
    function updateServiceLocation(string memory id, uint256 curIndex) 
    public onlyServiceAccount(id)
    {
        services[id].serviceLocationIndex = curIndex;
        emit ChangeService(id, "SERVICE_LOCATION");
    }

    /* Service Client */
    function getServiceLocation(string memory id) 
    public view hasService(id) isRunning(id)
    returns (string memory protocol, string memory point, string memory port)
    {
        uint256 index = services[id].serviceLocationIndex;
	    point = services[id].runtime.kct.servicePoints[index];
	    port = services[id].runtime.kct.servicePort;
        protocol = services[id].runtime.kct.serviceProtocol;
    }

}


