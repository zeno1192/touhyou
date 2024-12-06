import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import Chart from "https://cdn.jsdelivr.net/npm/chart.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore から投票データを取得
async function fetchVotingResults() {
  const votesCollection = collection(db, "Votes"); // コレクション名に合わせて変更
  const querySnapshot = await getDocs(votesCollection);

  const results = {};

  querySnapshot.forEach((doc) => {
    const { team, points } = doc.data();
    if (!results[team]) {
      results[team] = 0;
    }
    results[team] += points;
  });

  return results;
}

// 棒グラフを描画
async function renderChart() {
  const results = await fetchVotingResults();

  const teams = Object.keys(results);
  const points = Object.values(results);

  const ctx = document.getElementById("resultsChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: teams, // チーム名
      datasets: [
        {
          label: "投票ポイント",
          data: points, // ポイント数
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

renderChart();


renderChart();
