module.exports = {
  apps: [
    {
      name: "svelte-example",
      cwd: "./build",
      script: "index.js",
      instances: 1,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOST: "0.0.0.0",
      },
    },
  ],
};
