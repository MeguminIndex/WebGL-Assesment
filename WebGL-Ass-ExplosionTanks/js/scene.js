//add eent listner to call my on load function
window.addEventListener("load",initScene);


//THREE SCENE!!!!
var scene = new THREE.Scene();
var ambientLight;

//creates a render
var renderer = new THREE.WebGLRenderer({antialias:true});

var lastTime =0;
//var currentTime;

var currentTimePassed =0;
var timeDelay = 0.2;


//OBJECT LOADING
var objLoader;

var isSevenDiffuse;
var tankMaterial;

var lightDirection;
var mtlLoader;


var deltaTime;

//init function
function initScene(e)
{
    particleList =[];
    particlesVelocities =[];
   
    console.log("INIT CALLED");
    renderer.setSize(window.innerWidth,window.innerHeight);
    //add canvas to body of webpage so can render into it
    document.body.appendChild(renderer.domElement);

    scene.background = new THREE.Color(0x8300ff);

    window.addEventListener( 'resize', onWindowResize, false );

    ambientLight = new THREE.AmbientLight( 0x3b00ff, 2 );
    scene.add( ambientLight );
    
    //scene.fog = new THREE.FogExp2(0xffbe56, 0.005);
    scene.fog = new THREE.Fog(0xffbe56, 100, 1000);

    //scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
    lightDirection = new THREE.Vector3(0,1,0);

    ModelLoading();//calls all model loading code



    //create a cube for particles
    box = new THREE.BoxGeometry(1,1,1);
    //grab my shaders
    var shaders = ShaderLoader.getShaders('shaders/particle.vert', 'shaders/particle.frag');

    boxMat = new THREE.ShaderMaterial({
        uniforms:{
            pColour: {type:"v3", value: particleTint},
            lightDir: {type:"v3", value: lightDirection}
    
    },
        vertexShader: shaders.vertex,
        fragmentShader: shaders.fragment

    });

    explosionObject = new THREE.Mesh(box, boxMat);


    InitCamera();


    update();
    
}

function update(currentTime)
{
    //call this continously
    requestAnimationFrame(update);

   

    deltaTime = (currentTime - lastTime)/1000;
    //console.log("deltaTime: " + deltaTime);
  

    UpdateGame();

    //draw stuff
    renderer.render(scene,camera);
    lastTime = currentTime;
}


function UpdateGame()
{
    if(tanksGenerated == true)
    {
        updateTanks();
        UpdateParticles();
    }
    
   
    //found in the Input file
    UpdateCamera();

    currentTimePassed += deltaTime;

    if(currentTimePassed < timeDelay)
    {    
        return;
    }
    
    currentTimePassed = 0;

}

//Model Loading functions


//All the model laoding functions in here
function ModelLoading()
{
    console.log("Calling Model Loading Functions")

    objLoader = new THREE.OBJLoader();


    mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('models/WoT_IS7/');
    mtlLoader.load('IS7.mtl',function(materials){
    materials.preload();

        var tmpobjLoader = new THREE.OBJLoader();
        tmpobjLoader.setMaterials(materials);
        tmpobjLoader.setPath('models/WoT_IS7/');
        tmpobjLoader.load('IS7.obj', function(object)
        {
            console.log("Loded IS");
            tankBase = object.clone();
           // InitSceneTanks(object);
           isLoaded = true;

           if(isLoaded == true && togLoaded == true && ausfLoaded ==true &&tanksGenerated == false)
           InitSceneTanks(tankBase,togBase,ausfBase);
            //object.rotation.y =90;
           // scene.add(object);
        },onProgress,ObjectError);

    });


    mtlLoader.setPath('models/TOG/');
    mtlLoader.load('tog_II.mtl',function(materials){
        materials.preload();

        var tmpobjLoader = new THREE.OBJLoader();
        tmpobjLoader.setMaterials(materials);
        tmpobjLoader.setPath('models/TOG/');
        tmpobjLoader.load('tog_II.obj', function(object)
        {
            console.log("LOADED TOGS");
            togBase = object.clone();
            togLoaded = true;

            if(isLoaded == true && togLoaded == true && ausfLoaded ==true &&tanksGenerated == false)
           InitSceneTanks(tankBase,togBase,ausfBase);
            

            //object.rotation.y =90;
           // scene.add(object);
        },onProgress,ObjectError);

    });

    mtlLoader.setPath('models/ausf-b-obj/');
    mtlLoader.load('german-panzer-ww2-ausf-b.mtl',function(materials){
        materials.preload();

        var tmpobjLoader = new THREE.OBJLoader();
        tmpobjLoader.setMaterials(materials);
        tmpobjLoader.setPath('models/ausf-b-obj/');
        tmpobjLoader.load('german-ausf-b.obj', function(object)
        {
            console.log("LOADED ausf B");
            ausfBase = object.clone();
            ausfLoaded = true;

           if(isLoaded == true && togLoaded == true && ausfLoaded ==true &&tanksGenerated == false)
           InitSceneTanks(tankBase,togBase,ausfBase);
            

            //object.rotation.y =90;
           // scene.add(object);
        },onProgress,ObjectError);

    });
}



function onProgress ( xhr ) {

    if ( xhr.lengthComputable ) {

        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

    }

};

function ObjectError()
{
    console.log("Model Loading ERROR");
}





