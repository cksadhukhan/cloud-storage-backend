import Prometheus from "prom-client";

const register = new Prometheus.Registry();

register.setDefaultLabels({
  app: "cloud_storage",
});
Prometheus.collectDefaultMetrics({ register });

export default register;
