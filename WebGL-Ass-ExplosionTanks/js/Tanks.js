var isLoaded = false;
var togLoaded = false;
var ausfLoaded = false;
var tanksGenerated = false;
var tankBase ,togBase,ausfBase,BTR;//once the models loaded it will be coped here;

var numTanks = 50;
//the tanks in scene
var tankRendered;
var tanksArray;
var tanksCollisionDist = 5;


//particle stuff
var yParticalKillThresh = -1;
var minYellowThresh = -1, maxYellowThresh = 2;
var yellowIncreaseAmmount = 0.4;
var increseYellow = true;
var particleTint = new THREE.Vector3(10,0,0);
var boxMat;
var box;

var particalGravity = new THREE.Vector3(0,50,0);
var explosionObject; //will be where the object spawn for explosion particles is stored
var particleList = [];//stores all created particles
var particlesVelocities = [];//stores all the particles velocities
var maxParticleRemoveThresh = 10;



function InitSceneTanks(object,objectTwo,objectThree)
{
    
console.log("INIT TANKS");

    //tanksArray = new Array(numTanks * numTanks);
    tanksArray = [];
    tankRendered = [];
    var x = 1, z = 1;

    var index  = 0;

    var tmp;

    for(let i =0; i <numTanks; i++)
    {

        for(let j =0; j < numTanks; j++)
        {   
            //var tmp;
            var rng = Math.floor((Math.random() * 14) +1);
            if(rng >10)
            {
                tmp = objectThree.clone();
            }
            else if(rng > 5)
            {
            //var tmp = object.clone();
                tmp = objectTwo.clone(); 

            }
            else
            {
                tmp = object.clone();
            }
           
            tmp.position.x = 20*i -(20 * numTanks/2) ;
            tmp.position.z =  20*j - (20 * numTanks/2) ;

            tmp.rotation.y += Math.floor((Math.random()*360));

            tanksArray[index] = tmp;
            tankRendered[index] = true;
            scene.add(tanksArray[index]);

            index++;
        }


    }

    tanksGenerated = true;
}

function updateTanks()
{

    
    var size = tanksArray.length-1;

    var tankDirection = new THREE.Vector3(1,0,0);

     explosionObject.position = tanksArray[0].position.add(tankDirection);

    for(let i = 0; i<size; i++)
    {

        if(tankRendered[i] == true)
        {
            tanksArray[i].getWorldDirection(tankDirection);

            tankDirection.multiplyScalar(20);
            tankDirection.multiplyScalar(deltaTime);
            tanksArray[i].position = tanksArray[i].position.add(tankDirection);

        }
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

                
                    if(tanksArray[i].position.distanceTo(tanksArray[j].position) < tanksCollisionDist && tankRendered[i] == true && tankRendered[j] == true)
                    {
                               // console.log("collision occured");
                               tankRendered[i] = false;
                                SpawnParticles(tanksArray[j].position.x,tanksArray[j].position.y,tanksArray[j].position.z,15);
                                scene.remove(tanksArray[i]);


                    }
                    

            }
           
    
    
        }
    


    }


}

function ResetTanks()
{
    
    if(tanksGenerated == false)
        return;


    console.log("Reseting Tanks...");
    var size = tanksArray.length-1;
    //TO REFRESH SCENE REMOVE REMANING TANKS FROM IT
    for(let i = 0; i<size; i++)
    {
        scene.remove(tanksArray[i]);
    }

    

    InitSceneTanks(tankBase,togBase,ausfBase);


}

function SpawnParticles(x,y,z, numParticles)
{
   // exparticlesVelocities = object.clone();
    

    for(let p=0; p <numParticles; p++)
    {
            var tmpVel = new THREE.Vector3(Math.floor((Math.random() * 20) -10),Math.floor((Math.random() * 40) -5),Math.floor((Math.random() * 20) -10));

            particlesVelocities.push(tmpVel);

            var tmp = explosionObject.clone();

            var tmpRng = Math.random();
            if(tmpRng < 0.1)
                tmpRng = 0.1;
            tmp.scale.x = tmpRng;

            tmpRng = Math.random();
            if(tmpRng < 0.1)
                tmpRng = 0.1;

            tmp.scale.y = tmpRng;

                tmpRng = Math.random();
            if(tmpRng < 0.1)
                tmpRng = 0.1;
            tmp.scale.z = tmpRng;


            tmp.position.x = x;
            tmp.position.y = y;
            tmp.position.z = z;

       

            tmp.rotation.x = Math.floor((Math.random()*360));
            tmp.rotation.y = Math.floor((Math.random()*360));
            tmp.rotation.z = Math.floor((Math.random()*360));

            particleList.push(tmp);
            
            scene.add(particleList[particleList.length-1]);
    }
         
       


    

   
}


function UpdateParticles()
{
   
    var size = particleList.length;

    if(particleTint.z < minYellowThresh)
        increseYellow = true;
    else if(particleTint.z > maxYellowThresh)
        increseYellow = false;


    if(increseYellow)
    particleTint.z += yellowIncreaseAmmount *deltaTime;
    else
    particleTint.z -= yellowIncreaseAmmount *deltaTime;

    //console.log(size);
    //console.log(particlesVelocities.length);
    //var tmpVec = new THREE.Vector3(0,0,0);

   for(let p= 0; p < size; p++)
   {    

    particlesVelocities[p].x -= particalGravity.x *deltaTime; 
    particlesVelocities[p].y -= particalGravity.y *deltaTime;
    particlesVelocities[p].z -= particalGravity.z *deltaTime;

    particleList[p].position.x += particlesVelocities[p].x * deltaTime;
    particleList[p].position.y += particlesVelocities[p].y* deltaTime;
    particleList[p].position.z += particlesVelocities[p].z* deltaTime;

          
    //tmpVec = particleTint;

    //tmpVec =tmpVec.multiply(particlesVelocities[p]);

    //console.log(tmpVec);

    particleList[p].material.uniforms.pColour.value = particleTint;
    //particleList[p].material.uniforms.pColour.value = particleTint.multiply(particlesVelocities[p]);
    particleList[p].material.uniforms.lightDir.value = lightDirection;
      
   }


   for(let bp =size-1; bp >=0; bp--)
   {
        if(particleList[bp].position.y < yParticalKillThresh)
        {   
            scene.remove(particleList[bp]);
            //make sure to clean up the geo and mats before removing object.
            particleList[bp].geometry.dispose();
            particleList[bp].material.dispose();
            particleList.splice(bp, 1);
            particlesVelocities.splice(bp,1);
        }

   }


}

