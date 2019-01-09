
//Handlers
window.addEventListener("wheel",ScrollWheel);
window.addEventListener("keydown",Input);

var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);

var lookAtOffset = new THREE.Vector3(0,-40,-100);
var lookAtPos = new THREE.Vector3(0,0,0);

var camSpeed = 50, camVertSpeed = 10, camRotateSpeed = 10;
var camZPos = 100, camYPos = 35, camXPos =0;

function InitCamera()
{

    //camera.rotation.x =320;
    camera.position.z = camZPos;
    camera.position.y = camYPos;   

    lookAtPos = new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z);
    lookAtPos.add(lookAtOffset);
    camera.lookAt(lookAtPos);
}


function UpdateCamera()
{
    var direction;
    //camera.getWorldDirection(direction);

    camera.position.z = camZPos;
    camera.position.y = camYPos;
    camera.position.x = camXPos;

    lookAtPos = new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z);
    lookAtPos.add(lookAtOffset);
    camera.lookAt(lookAtPos);
}



function onWindowResize()
{

    camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);

    

}


function ScrollWheel(e)
{
   // console.log("In my input file");
    camYPos -=(e.deltaY/1000) *camVertSpeed;
 //   camZPos += e.deltaY/20;
}


function Input(e)
{
    //console.log(e.key);

     if(e.key == "a")
     {
         camXPos-= camSpeed *deltaTime
     }
     else if(e.key == "d")
     {
         camXPos+= camSpeed *deltaTime
     }
     else if(e.key == "w")
     {
        camZPos-= camSpeed *deltaTime
     }
     else if(e.key == "s")
     {
        camZPos+= camSpeed *deltaTime
     }
     else if(e.key == "r")
     {
        ResetTanks();
       
     }

     else if(e.key == "q")
     {
        lookAtOffset.x -= camRotateSpeed *deltaTime;
     }
     else if(e.key == "e")
     {
        lookAtOffset.x += camRotateSpeed *deltaTime;
     }


    

}

