function requireAll(r) {
  r.keys().forEach(r);
}

requireAll(require.context('./', true, /\.(png|jpe?g|gif|svg)$/));
