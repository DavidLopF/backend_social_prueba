import colors from 'colors';
colors.enable();

// Configurar variables de entorno para tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.AWS_ACCESS_KEY_ID = 'test-key';
process.env.AWS_SECRET_ACCESS_KEY = 'test-secret';
process.env.AWS_REGION = 'test-region';
process.env.AWS_ENDPOINT = 'http://localhost:9000';
process.env.AWS_BUCKET_NAME = 'test-bucket'; 