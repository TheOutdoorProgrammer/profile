const faroWebSdk = window.GrafanaFaroWebSdk;
const faroWebTracing = window.GrafanaFaroWebTracing;

if (faroWebSdk && faroWebTracing) {
  faroWebSdk.initializeFaro({
    url: "https://faro-collector-prod-us-east-3.grafana.net/collect/e58d29c1033f2b7d4321c0ede2ef8fd4",
    app: {
      name: "The Outdoor Programmer",
      version: "1.0.0",
      environment: "production",
    },
    instrumentations: [
      ...faroWebSdk.getWebInstrumentations(),
      new faroWebTracing.TracingInstrumentation(),
    ],
  });
}
