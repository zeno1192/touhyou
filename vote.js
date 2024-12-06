import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCSJNkXlmr1xToKV6iR_o9Sp3gLsqqd6eA",
  authDomain: "touhyouproject.firebaseapp.com",
  projectId: "touhyouproject",
  storageBucket: "touhyouproject.firebasestorage.app",
  messagingSenderId: "662619066348",
  appId: "1:662619066348:web:6924f4dfb8c47de7097ac9"
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const userInfoDiv = document.getElementById('user-info');
const balanceDiv = document.getElementById('balance');
const voteForm = document.getElementById('voteForm');
const messageDiv = document.getElementById('message');
const logoutButton = document.getElementById('logoutButton');

// ユーザー情報と残高を取得
let currentUser = null;
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    userInfoDiv.textContent = `ログイン中: ${user.email}`;

    const userDoc = await getDoc(doc(db, "Users", user.uid));
    if (userDoc.exists()) {
      balanceDiv.textContent = `残高: ${userDoc.data().points} ポイント`;
    } else {
      messageDiv.textContent = "ユーザー情報が見つかりません。";
    }
  } else {
    alert("ログインしてください！");
    window.location.href = './index.html';
  }
});

// 投票処理
voteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const team = document.getElementById('team').value;
  const points = parseInt(document.getElementById('points').value, 10);

  if (!team || isNaN(points) || points <= 0) {
    messageDiv.textContent = "正しいチームとポイントを入力してください。";
    return;
  }

  const userDocRef = doc(db, "Users", currentUser.uid);
  const userDoc = await getDoc(userDocRef);
  const currentPoints = userDoc.data().points;

  if (points > currentPoints) {
    messageDiv.textContent = "残高が不足しています。";
    return;
  }

  try {
    await addDoc(collection(db, "Votes"), {
      team: team,
      points: points,
      user: currentUser.email,
      timestamp: new Date(),
    });

    await updateDoc(userDocRef, {
      points: currentPoints - points,
    });

    balanceDiv.textContent = `残高: ${currentPoints - points} ポイント`;
    messageDiv.textContent = `チーム「${team}」に${points}ポイント投票しました！`;
    voteForm.reset();
  } catch (error) {
    messageDiv.textContent = `投票に失敗しました: ${error.message}`;
  }
});

// ログアウト処理
logoutButton.addEventListener('click', async () => {
  try {
    await signOut(auth);
    alert("ログアウトしました！");
    window.location.href = './index.html';
  } catch (error) {
    messageDiv.textContent = `ログアウトに失敗しました: ${error.message}`;
  }
});
