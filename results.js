import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

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

// 投票データを取得してテーブルに表示
async function displayResults() {
  const votesCollection = collection(db, "Votes"); // Firestore コレクション名に合わせる
  const querySnapshot = await getDocs(votesCollection);

  const results = {};

  querySnapshot.forEach((doc) => {
    const { team, points } = doc.data();
    if (!results[team]) {
      results[team] = 0;
    }
    results[team] += points;
  });

  // テーブルにデータを挿入
  const tableBody = document.querySelector("#resultsTable tbody");
  tableBody.innerHTML = ""; // 既存の内容をクリア

  Object.entries(results).forEach(([team, points]) => {
    const row = document.createElement("tr");

    const teamCell = document.createElement("td");
    teamCell.textContent = team;

    const pointsCell = document.createElement("td");
    pointsCell.textContent = points;

    row.appendChild(teamCell);
    row.appendChild(pointsCell);

    tableBody.appendChild(row);
  });
}

// 実行
displayResults();


displayResults();
