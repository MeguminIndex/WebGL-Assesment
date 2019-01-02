//<script src="../build/three.js"></script>


//add eent listner to call my on load function
window.addEventListener("load",initScene);


//window.addEventListener("wheel",ScrollWheel);

//THREE SCENE!!!!
var scene = new THREE.Scene();

//perspective camera
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);

//creates a render
var renderer = new THREE.WebGLRenderer({antialias:true});


var lastTime =0;
//var currentTime;

var currentTimePassed =0;
var timeDelay = 0.1;

var tanksGenerated = false;
var tankBase;//once the models loaded it will be coped here;
var numTanks = 60;
//the tanks in scene
var tanksArray;
var tanksCollisionDist = 2.5;

var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

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
    

    console.log("INIT CALLED");

    renderer.setSize(window.innerWidth,window.innerHeight);
    //add canvas to body of webpage so can render into it
    document.body.appendChild(renderer.domElement);

    scene.background = new THREE.Color(0x330136);


    window.addEventListener( 'resize', onWindowResize, false );

    var ambientLight = new THREE.AmbientLight( 0xFF5E35, 0.9 );
	scene.add( ambientLight );

    lightDirection = new THREE.Vector3(0,1,0);

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

            InitSceneTanks(object);
            

            //object.rotation.y =90;
           // scene.add(object);
        },onProgress,ObjectError);

    });



   


    //  var textureShader = ShaderLoader.getShaders('shaders/textured.vert', 'shaders/textured.frag');


    //  tankMaterial  = new THREE.ShaderMaterial({
    //      uniforms:
    //     {
    //         mainTexture: { type:"t", value: isSevenDiffuse },
    //         lightDir : { type:"v3", value: lightDirection }
    //     },
    //         vertexShader: textureShader.vertex,
    //         fragmentShader: textureShader.fragment
    //     });
        


    //create a cubve
    //var box = new THREE.BoxGeometry(1,1,1);

    // var shaders = ShaderLoader.getShaders('shaders/default.vert', 'shaders/diffuse.frag');

    // material = new THREE.ShaderMaterial({
    //     uniforms:{},
    //     vertexShader: shaders.vertex,
    //     fragmentShader: shaders.fragment

    // });


    //var geometry = new THREE.BoxGeometry( .5, .5, .5 );
    //Create a (1x1x1) cube geometry
    //var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    //Create a mesh from this geometry and material
   // cube = new THREE.Mesh(geometry, material);
    //Add the cube to the scene
    //scene.add( cube );
    //Position the camera behind the cube and call update initially

camYPos +=20;

    camera.position.z = camZPos;
    camera.position.y = camYPos;
    

    //manually set some cells

   // screenGrid[3][9] = true;
   // screenGrid[1][3] = true;
   // screenGrid[7][7] = true;
    update();
    
}



function InitSceneTanks(object)
{
    tankBase = object.clone();
console.log("INIT TANKS");

    //tanksArray = new Array(numTanks * numTanks);
    tanksArray = [];

    var x = 1, z = 1;

    var index  = 0;

    for(let i =0; i <numTanks; i++)
    {

        for(let j =0; j < numTanks; j++)
        {
            var tmp = object.clone();

            tmp.position.x = 20*i -(20 * numTanks/2) ;
            tmp.position.z =  20*j - (20 * numTanks/2) ;

            tmp.rotation.y = Math.floor((Math.random()*360));

            tanksArray[index] = tmp;
            
            scene.add(tanksArray[index]);

            index++;
        }


    }

    tanksGenerated = true;
}



function update(currentTime)
{
    
//console.log("UPDATE CALLED");
   
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
    updateTanks();


    camera.position.z = camZPos;
    camera.position.y = camYPos;
    camera.position.x = camXPos;

    currentTimePassed += deltaTime;

    if(currentTimePassed < timeDelay)
    {    
        return;
    }
    
   
    
    currentTimePassed = 0;

}


function updateTanks()
{


    var size = tanksArray.length-1;

    var tankDirection = new THREE.Vector3();

    for(let i = 0; i<size; i++)
    {
        tanksArray[i].getWorldDirection(tankDirection);

        tankDirection.multiplyScalar(20);
        tankDirection.multiplyScalar(deltaTime);
        tanksArray[i].position = tanksArray[i].position.add(tankDirection);

        //tanksArray[i].rotation.y = Math.floor((Math.random()*360));

        //console.log(tankDirection.multiplyScalar(20));

    }

    CheckTankCollision();


}

function CheckTankCollision()
{
    var lastElement = tanksArray.length -1;
    
    for(let i =lastElement; i >=0; i--)
    {

        for(let j =lastElement; j >=0; j--)
        {
            if(i != j)
            {

                
                    if(tanksArray[i].position.distanceTo(tanksArray[j].position) < tanksCollisionDist)
                    {
                               // console.log("collision occured");

                                scene.remove(tanksArray[i]);
                               // tanksArray.splice(i,1);

                               // console.log("i: " + i + " J: " + j);
                    }
                    

            }
           
    
    
        }
    


    }


}

function ResetTanks()
{
    if(tanksGenerated == false)
        return;

    var size = tanksArray.length-1;
    //TO REFRESH SCENE REMOVE REMANING TANKS FROM IT
    for(let i = 0; i<size; i++)
    {
        scene.remove(tanksArray[i]);
    }

    

    InitSceneTanks(tankBase);


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





