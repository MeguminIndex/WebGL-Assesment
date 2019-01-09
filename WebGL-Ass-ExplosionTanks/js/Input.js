
//Handlers
window.addEventListener("wheel",ScrollWheel);
window.addEventListener("keydown",Input);

var camSpeed = 50;
var camZPos = 100, camYPos = 15, camXPos =0;



function onWindowResize()
{

    camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);


}


function ScrollWheel(e)
{
    console.log("In my input file");
    camYPos -=e.deltaY/1000;
    camZPos += e.deltaY/20;
}


function Input(e)
{
console.log(e.key);

     if(e.key == "a")
     {
         camXPos-= camSpeed *deltaTime
     }
     else if(e.key == "d")
     {
         camXPos+= camSpeed *deltaTime
     }
     else if(e.key == "r")
     {
        ResetTanks();
       
     }

    

}

