const env = 'prod';

export const url = () => {
  if (env === 'prod') {
    return '/';
  }

  if (env === 'dev') {
    return 'http://localhost:5000/';
  }

  if (env === 'dev-host') {
    return 'http://192.168.1.112:5000/';
  }
};

export const API_URL = url();

// ('https://liebevollbelichtet.de/');

// export const API_URL = 'http://192.168.1.112:5000/';
