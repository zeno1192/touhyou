import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import Chart from "https://cdn.jsdelivr.net/npm/chart.js";

const firebaseConfig = {
  apiKey: "AIzaSyCSJNkXlmr1xToKV6iR_o9Sp3gLsqqd6eA",
  authDomain: "touhyouproject.firebaseapp.com",
  projectId: "touhyouproject",
  storageBucket: "touhyouproject.firebasestorage.app",
  messagingSenderId: "662619066348",
  appId: "1:662619066348:web:6924f4dfb8c47de7097ac9"
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 投票データを取得する関数
async function fetchVotingResults() {
  const votesCollection = collection(db, "Votes"); // "Votes" コレクションの名前に合わせる
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

// 棒グラフを描画する関数
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
