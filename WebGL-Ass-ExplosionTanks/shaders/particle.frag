varying vec3 fPosition;
varying vec3 fNormal;

uniform vec3 lightDir;
uniform vec3 pColour;
void main()
{
    //The directional light source -- what direction light is coming from
    //vec3 light = vec3(0, 1, 0);
    //Calculate the lambertian reflectance term
    float lambert = dot(normalize(fNormal), normalize(lightDir));
    //Calculate ambient light
    vec3 ambient = pColour * 0.5;
    //And set the final output color
    gl_FragColor = vec4(ambient + lambert * vec3(1, 0, 0), 1.0);  
}
