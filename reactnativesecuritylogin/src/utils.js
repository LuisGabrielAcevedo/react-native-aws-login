const jwt_decode = require('jwt-decode');
// const jwkToPem = require('jwk-to-pem');

// El back tendria que hacer esto, sacar el token del header y comparar unos parametros
// con lo que devuelve cognito en esa llamada

export const validateToken = (token) => {
  var decoded = jwt_decode(token);
  console.log(decoded);
  fetch(
    'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_1PDEtB4eB/.well-known/jwks.json',
    {method: 'GET'},
  )
    .then((resp) => resp.json())
    .then((resp) => {
      console.log(resp);
    });
};
