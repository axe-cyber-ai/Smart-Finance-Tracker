module.exports = {
  apps: [
    {
      name: 'smart-finance-tracker',
      script: 'src/app.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        APP_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        APP_ENV: 'production',
        PORT: 3000,
      },
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
    },
  ],
};
