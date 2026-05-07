if (typeof mermaid !== "undefined") {
  mermaid.initialize({
    startOnLoad: true,
    theme: "base",
    gantt: {
      barHeight: 38,
      barGap: 8,
      topPadding: 64,
      leftPadding: 130,
      gridLineStartPadding: 120,
      fontSize: 18,
      numberSectionStyles: 5
    },
    themeVariables: {
      primaryColor: "#f5c518",
      primaryTextColor: "#1f1b11",
      primaryBorderColor: "#807660",
      lineColor: "#695200",
      tertiaryColor: "#fff8f1",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      fontSize: "18px"
    }
  });
}