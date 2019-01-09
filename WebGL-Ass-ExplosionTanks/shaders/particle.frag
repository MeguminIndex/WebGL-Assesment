varying vec3 fPosition;
varying vec3 fNormal;

uniform vec3 lightDir;
uniform vec3 pColour;
void main()
{
    vec3 rimlightColour=vec3(1, 0.4, 0);
    vec3 rimparams=vec3(0.7, 1.0, 0.1); // = (cutoff_start,cutoff_end,rimlightintensity)


    //Calculate the lambertian reflectance term
    float lambert = dot(normalize(fNormal), normalize(lightDir));

    //Calculate ambient light
    vec3 ambient = pColour * 0.5;
    
    //gl_FragColor = vec4(ambient + lambert * vec3(1, 0, 0), 1.0);  




    //Calculate the rim value
    float rimValue = 0.3;
    //Cutoff start and end for rim highlights
    vec2 cutoff = vec2(0.7, 1.0);
    //Use interpolation to limit the range of values to control rim "width"
    rimValue = smoothstep(rimparams.x, rimparams.y, rimValue) * rimparams.z;
     
    vec3 finalRimColor = rimValue * rimlightColour * rimparams.z;
    //Set output colour
    gl_FragColor = vec4((ambient + lambert * vec3(1, 0, 0)) + (fNormal + finalRimColor), 1.0);



}
