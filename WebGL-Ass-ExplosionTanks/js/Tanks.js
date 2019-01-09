var isLoaded = false;
var togLoaded = false;
var ausfLoaded = false;
var tanksGenerated = false;
var tankBase ,togBase,ausfBase,BTR;//once the models loaded it will be coped here;

var numTanks = 40;//alters size of grid
var tankSpeed = 20;
//the tanks in scene
var tankRendered;
var tanksArray;
var tanksCollisionDist = 5;


var maxDisAway = 700;
var centerPoint = new THREE.Vector3(0,0,0);


//particle stuff
var yParticalKillThresh = -1;
var minYellowThresh = -1, maxYellowThresh = 2;
var yellowIncreaseAmmount = 0.6;
var increseYellow = true;
var particleTint = new THREE.Vector3(10,0,0);
var boxMat;
var box;

var particalGravity = new THREE.Vector3(0,50,0);
var explosionObject; //will be where the object spawn for explosion particles is stored
var particleList = [];//stores all created particles
var particlesVelocities = [];//stores all the particles velocities
var maxParticleRemoveThresh = 10;
var minParticleSize = 0.2;
var particalsPerExplosion = 25;

function InitSceneTanks(object,objectTwo,objectThree)
{
    
console.log("INIT TANKS");

    //tanksArray = new Array(numTanks * numTanks);
    tanksArray = [];
    tankRendered = [];
    var x = 1, z = 1;

    var index  = 0;

    //var tmp;

    for(let i =0; i <numTanks; i++)
    {

        for(let j =0; j < numTanks; j++)
        {   
            //var tmp;

            

            var x = 20*i -(20 * numTanks/2) ;
            var z =  20*j - (20 * numTanks/2) ;

            var rotY = Math.floor((Math.random()*360));



            var rng = Math.floor((Math.random() * 14) +1);
            if(rng >10)
            {
                //tmp = objectThree.clone();
                AddTank(object,x,z,rotY);
            }
            else if(rng > 5)
            {
            
                //tmp = objectTwo.clone(); 
                AddTank(objectTwo,x,z,rotY);
            }
            else
            {
                //tmp = object.clone();
                AddTank(object,x,z,rotY);
            }
           
            // tmp.position.x = 20*i -(20 * numTanks/2) ;
            // tmp.position.z =  20*j - (20 * numTanks/2) ;

            // tmp.rotation.y += Math.floor((Math.random()*360));

            // tanksArray[index] = tmp;
            // tankRendered[index] = true;
            // scene.add(tanksArray[index]);

            index++;
        }


    }

    tanksGenerated = true;
}


function AddTank(obj,x,z,rotY)
{   
    var tmp = obj.clone();
    tmp.position.x = x ;
    tmp.position.z = z ;

    tmp.rotation.y += rotY;

    var size = tanksArray.length;
    tanksArray[size] = tmp;
    tankRendered[size] = true;
    scene.add(tanksArray[size]);
}

function updateTanks()
{   
    var size = tanksArray.length;

    var tankDirection = new THREE.Vector3(1,0,0);

    // explosionObject.position = tanksArray[0].position.add(tankDirection);

    for(let i = 0; i<size; i++)
    {

      //  var centerPoint = new THREE.Vector3(0,0,0);
     
        if(tankRendered[i] == true)
        {


            var d = centerPoint.distanceTo(tanksArray[i].position)
        

            if( d > maxDisAway)
            {   
                tanksArray[i].lookAt(centerPoint.x,centerPoint.y,centerPoint.z);
            }
    
    


            tanksArray[i].getWorldDirection(tankDirection);

            tankDirection.multiplyScalar(tankSpeed);
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
                                SpawnParticles(explosionObject,tanksArray[j].position.x,tanksArray[j].position.y,tanksArray[j].position.z,particalsPerExplosion);
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

//Spawns particvles
function SpawnParticles(object,x,y,z, numParticles)
{
   // exparticlesVelocities = object.clone();
    

    for(let p=0; p <numParticles; p++)
    {
            var tmpVel = new THREE.Vector3(Math.floor((Math.random() * 20) -10),Math.floor((Math.random() * 40) -5),Math.floor((Math.random() * 20) -10));

            particlesVelocities.push(tmpVel);

            var tmp = object.clone();

            var tmpRng = Math.random();
            if(tmpRng < minParticleSize)
                tmpRng = minParticleSize;

            
            tmp.scale.x = tmpRng;
            
            tmpRng = Math.random();
            if(tmpRng < minParticleSize)
                tmpRng = minParticleSize;
           
            tmp.scale.y = tmpRng;

            tmpRng = Math.random();
            if(tmpRng < minParticleSize)
                tmpRng = minParticleSize;
            
            
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

    if(particleTint.y < minYellowThresh)
        increseYellow = true;
    else if(particleTint.y > maxYellowThresh)
        increseYellow = false;


    if(increseYellow)
    particleTint.y += yellowIncreaseAmmount *deltaTime;
    else
    particleTint.y -= yellowIncreaseAmmount *deltaTime;

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

