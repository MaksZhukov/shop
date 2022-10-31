module.exports = {
  apps: [
    // {
    //     name: "app1",
    //     script: "./server.js",
    //     env: {
    //         PORT: 1337,
    //         NODE_ENV: "production",
    //     },
    // },
    // {
    //     name: "app2",
    //     script: "./server.js",
    //     env: {
    //         PORT: 1338,
    //         NODE_ENV: "production",
    //     },
    // },
    {
      script: "server.js",
      name: "client",
      env: {
        PORT: 3000,
        NODE_ENV: "production",
        NODE_TLS_REJECT_UNAUTHORIZED: 0,
      },
      // instances: "max",
      // exec_mode: "cluster",
      max_memort_restart: "500m",
    },
  ],
};
