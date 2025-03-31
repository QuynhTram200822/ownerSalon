const arrowPlugin = {
  id: "arrowPlugin",
  afterDraw: (chart) => {
    const ctx = chart.ctx;
    chart.data.datasets.forEach((dataset, i) => {
      if (dataset.type === "line") {
        // Chỉ áp dụng cho line chart
        const meta = chart.getDatasetMeta(i);
        const points = meta.data;

        if (points.length > 1) {
          const lastPoint = points[points.length - 1]; // Điểm cuối cùng
          const prevPoint = points[points.length - 2]; // Điểm trước đó

          // Tính toán góc của đường line
          let angle = Math.atan2(
            lastPoint.y - prevPoint.y,
            lastPoint.x - prevPoint.x
          );

          // 🔥 Điều chỉnh góc hướng lên cao hơn
          angle -= Math.PI / 5; // Điều chỉnh góc lệch lên

          // Tăng độ dài đoạn kéo dài
          const extendLength = 130; // Điều chỉnh độ dài đường mở rộng
          const newX = lastPoint.x + Math.cos(angle) * extendLength;
          const newY = lastPoint.y + Math.sin(angle) * extendLength;

          // 🔥 Điều chỉnh kích thước mũi tên
          const arrowSize = 20; // Kích thước mũi tên

          // Vẽ mũi tên tam giác cân
          ctx.save();
          ctx.translate(newX, newY);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(0, 0); // Đỉnh tam giác (trùng với điểm cuối đường kéo dài)
          ctx.lineTo(-arrowSize, arrowSize / 2); // Cánh dưới
          ctx.lineTo(-arrowSize, -arrowSize / 2); // Cánh trên
          ctx.closePath();
          ctx.fillStyle = dataset.borderColor;
          ctx.fill();
          ctx.restore();

          // 🔥 Vẽ đường kéo dài hướng lên cao hơn
          ctx.beginPath();
          ctx.moveTo(lastPoint.x, lastPoint.y);
          ctx.lineTo(newX, newY);
          ctx.strokeStyle = dataset.borderColor;
          ctx.lineWidth = dataset.borderWidth || 2;
          ctx.stroke();
        }
      }
    });
  },
};

const ctx = document.getElementById("comboChart").getContext("2d");
Chart.register(ChartDataLabels, arrowPlugin); // Đăng ký plugin

// Thiết lập barThickness cho tất cả các dataset có type "bar"
const barThicknessValue = 54; // Định nghĩa giá trị barThickness muốn áp dụng

// Lặp qua tất cả datasets và thêm barThickness cho các dataset có type "bar"
const datasets = [
  {
    type: "bar",
    label: "円収入",
    data: [210, 600, 820],
    backgroundColor: "#99379B",
    order: 2,
  },
  {
    type: "bar",
    label: "出店費用",
    data: [700, 70, 30],
    backgroundColor: "#1BADE4",
    order: 2,
  },
  {
    type: "bar",
    label: "內容費用",
    data: [0, 200, 65],
    backgroundColor: "#2384C8",
    order: 2,
  },
  {
    type: "bar",
    label: "雜費",
    data: [0, 35, 30],
    backgroundColor: "#28CCDD",
    order: 2,
  },
  {
    type: "bar",
    label: "人件費",
    data: [0, 50, 35],
    backgroundColor: "#41BA96",
    order: 2,
  },
  {
    type: "bar",
    label: "補償金(3个月)",
    data: [0, 85, 85],
    backgroundColor: "#3C8A50",
    order: 2,
  },
  {
    type: "line",
    label: "Revenue",
    data: [200, 600, 800],
    borderColor: "#FFC700",
    backgroundColor: "#FFC700",
    borderWidth: 4,
    fill: false,
    tension: 0, // Làm mịn đường
    order: 1,
    pointRadius: 8,
  },
];

// Thêm barThickness cho các dataset có type là "bar"
datasets.forEach(dataset => {
  if (dataset.type === "bar") {
    dataset.barThickness = window.innerWidth < 768 ? 40 : 56; // Áp dụng giá trị barThickness theo điều kiện kích thước màn hình
  }
});

const comboChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["個人開業", "シェアサロン", "Owner's Salon"],
    datasets: datasets, // Datasets đã được thêm barThickness
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        align: "center",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: window.innerWidth < 768 ? 7.48 : 16,
            weight: "400",
            lineHeight: 1.625,
          },
          filter: function (legendItem) {
            return legendItem.text !== "Revenue";
          },
        },
      },
      datalabels: {
        display: true,
        color: "white",
        anchor: "center",
        align: "center",
        font: { size: window.innerWidth < 768 ? 10 : 14, weight: "700" },
        formatter: function (value, context) {
          return context.dataset.label === "円収入"
            ? context.dataset.label
            : "";
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: { size: window.innerWidth < 768 ? 12 : 20, weight: 700 },
          color: "#373338",
          padding: 20,
        },
        grid: { borderDash: [5, 5], display: false },
      },
      y: {
        stacked: true,
        ticks: {
          font: { size: window.innerWidth < 768 ? 6.07 : 16, weight: 400 },
          color: "#373338",
          stepSize: 200,
          callback: function (value) {
            return value <= 1200 ? value : "";
          },
        },
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: function (context) {
            return context.tick.value % 200 === 0
              ? "rgba(0, 0, 0, 0.2)"
              : "transparent";
          },
        },
      },
    },
  },
});
