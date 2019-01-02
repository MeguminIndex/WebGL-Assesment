
     
    varying vec3 fNormal;
    varying vec3 fPosition;
    varying vec2 fuv;

    void main()
    {
     //Pass the normal (convert to world-space coordinates with normalMatrix)
     fNormal = normalize(normalMatrix * normal);
     //Convert position to world-space coordinates using mv matrix
     vec4 pos = modelViewMatrix * vec4(position, 1.0);
     //Pass as fPosition to fragment shader
     fPosition = pos.xyz;

    fuv = uv;

     //Set the final position of this vertex to the world pos
     //taking into account camera projection parameters
     gl_Position = projectionMatrix * pos;
    }