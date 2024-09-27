import Prometheus from "prom-client";

const register = new Prometheus.Registry();

register.setDefaultLabels({
  app: "cloud_storage",
});
Prometheus.collectDefaultMetrics({ register });

console.log("register", register);

export default register;
